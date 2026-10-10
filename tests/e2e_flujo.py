"""
Prueba E2E del flujo completo de Foodtomation con Playwright.

Recorre el ciclo de un pedido entre las cuatro interfaces, cada una en
su propia pestaña (como dispositivos distintos), y verifica que se
sincronicen sin recargar la página:

  tablet (pedido) → cocina (preparar / listo) → mesero (entregar)
  → tablet (pedir la cuenta) → caja (cobrar)

Uso:
  pip install playwright && python -m playwright install chromium
  npm run dev                              # en otra terminal
  python tests/e2e_flujo.py http://localhost:8443
"""
import re
import sys
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://localhost:8443'


def paso(vista: str, texto: str) -> None:
    print(f'  [{vista:<6}] {texto}', flush=True)


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context()  # mismo contexto = mismo almacenamiento compartido

        def open_page(path: str, w: int, h: int):
            page = ctx.new_page()
            page.set_viewport_size({'width': w, 'height': h})
            page.goto(BASE + path)
            return page

        cocina = open_page('/#/kds', 1920, 1080)
        mesero = open_page('/#/mesero', 390, 844)
        tablet = open_page('/?mesa=4#/', 1280, 800)

        # 1. El cliente arma su pedido con un modificador y una observación especial
        tablet.click('.k-tab:has-text("Platos fuertes")')
        tablet.click('.k-card:has-text("Hamburguesa de la casa")')
        tablet.click('.k-mod:has-text("Sin cebolla")')
        tablet.fill('#obs', 'Alergia al maní')
        tablet.click('.k-add-btn')
        tablet.click('.k-cart-btn')
        expect(tablet.locator('.k-summary-total')).to_contain_text('$22.00')
        paso('tablet', 'Hamburguesa + "Sin cebolla" + obs. "Alergia al maní" · total $22.00')

        # 2. Envía a cocina confirmando en la ventana modal
        tablet.click('.k-send-btn')
        expect(tablet.locator('.modal')).to_be_visible()
        tablet.click('.modal-confirm')
        expect(tablet.locator('text=¡Pedido enviado a cocina!')).to_be_visible()
        paso('tablet', 'Ventana modal de confirmación → pedido enviado a cocina')

        # 3. La cocina lo recibe sin recargar, con la alergia resaltada
        ticket = cocina.locator('article:has-text("MESA 04")')
        expect(ticket).to_be_visible()
        expect(ticket).to_contain_text(re.compile('alergia al maní', re.I))
        paso('cocina', 'Comanda MESA 04 recibida con alerta de alergia')

        # 4. Bump bar: primera pulsación → preparación, segunda → listo
        slot = ticket.locator('div').first.inner_text().strip()
        cocina.keyboard.press(slot)
        expect(ticket).to_contain_text('EN PREPARACIÓN')
        cocina.keyboard.press(slot)
        paso('cocina', f'Tecla {slot} → EN PREPARACIÓN · tecla {slot} → LISTO')

        # 5. El mesero recibe el aviso y confirma la entrega
        expect(mesero.locator('.m-alert')).to_contain_text('Mesa 04')
        mesero.click('.m-card-ready:has-text("Mesa 04") .m-deliver')
        paso('mesero', 'Aviso "Mesa 04" → Entregado en la mesa')

        # 6. El cliente pide la cuenta y la tablet queda limpia
        tablet.click('text=Volver al menú')
        tablet.click('.k-orders-btn')
        expect(tablet.locator('.k-bill-btn')).to_be_enabled()
        tablet.click('.k-bill-btn')
        expect(tablet.locator('text=¡Gracias por tu visita!')).to_be_visible()
        paso('tablet', 'Pedir la cuenta → la tablet queda lista para el siguiente cliente')

        # 7. La caja cobra en efectivo con propina y cambio
        caja = open_page('/#/caja', 1366, 800)
        caja.click('.c-card:has-text("Mesa 04")')
        caja.click('.c-toggle')
        caja.click('.c-method:has-text("Efectivo")')
        caja.fill('#recibido', '30')
        expect(caja.locator('.c-change')).to_contain_text('$5.80')
        caja.click('.c-pay-btn')
        caja.click('.modal-confirm')
        expect(caja.locator('.c-toast')).to_contain_text('Mesa 04 cerrada')
        paso('caja', 'Efectivo $30.00 → cambio $5.80 → Mesa 04 cerrada')

        browser.close()
        print('✓ Flujo completo verificado: tablet → cocina → mesero → caja')


if __name__ == '__main__':
    main()
