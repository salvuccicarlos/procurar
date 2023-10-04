const puppeteer = require('puppeteer');

(async () => {
    // Iniciar el navegador
    const browser = await await puppeteer.launch({
        headless: false,
        slowMo: 10,
        devtools: true
    });

    // Abrir una nueva pestaña
    const page = await browser.newPage();

    // Navegar al sitio web del PJN
    await page.goto('https://www.pjn.gov.ar/gestion-judicial');

    // Click en ingresar a Gestión Causas para loguearse
    try {
        // Esperar a que el elemento esté disponible en la página
        await page.waitForSelector('p.p-menu-principal', {
            timeout: 5000
        });

        const data = await page.evaluate(() => {
            const element = Array.from(document.querySelectorAll('p.p-menu-principal')).find(el => el.textContent === 'Gestión Causas');
            if (element) {
                element.closest('a').click();
            }
        });
    } catch (error) {
        console.error('Error al encontrar el elemento:', error);
    }

    // Escuchar el evento de creación de una nueva pestaña para Iniciar Sesion de PJN 
    const [iniciarSesionPage] = await Promise.all([
        new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
    ]);

    await iniciarSesionPage.waitForSelector('#username', {
        timeout: 5000
    }); // Espera hasta que el input con id "username" aparezca
    await iniciarSesionPage.type('#username', '20111616036'); // Escribe en el input de usuario 
    await iniciarSesionPage.type('#password', 'ae0708uu'); // Escribe en el input de la contraseña 
    await iniciarSesionPage.click('#kc-login');

    //Click en "Consultas" para ver expedientes
    await iniciarSesionPage.waitForSelector('div[role="menuitem"][title="Sistema de Consultas Web"]', {
        timeout: 10000
    });
    await iniciarSesionPage.evaluate(() => {
        const element = document.querySelector('div[role="menuitem"][title="Sistema de Consultas Web"]');
        if (element) {
            element.click();
        } else {
            console.log("Elemento no encontrado");
        }
    });

    // Escuchar el evento de creación de una nueva pestaña de Consultas
    const [expedientesPage] = await Promise.all([
        // Escuchar el evento de creación de una nueva pestaña
        new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
    ]);
    await expedientesPage.evaluate(() => console.log("Estoy en la nueva pestaña"));

    let data = [];

    // Obtener el número de páginas o controles para iterar
    try {
        await expedientesPage.waitForSelector('.pagination', {
            timeout: 5000
        });

        const numberOfPages = await expedientesPage.$$eval('.pagination li', liElements => liElements.length);

        console.log('Número de páginas: ' + numberOfPages);

        // ... el resto del código

        for (let i = 0; i < numberOfPages; i++) {

            console.log(`Procesando página ${i} de ${numberOfPages}`);

            const headers = await expedientesPage.evaluate(() => {
                const ths = Array.from(document.querySelectorAll('table thead th'));
                return ths.map(th => th.textContent.trim());
            });

            const rows = await expedientesPage.evaluate(() => {
                const trs = Array.from(document.querySelectorAll('table tbody tr'));
                return trs.map(tr => {
                    const tds = Array.from(tr.getElementsByTagName('td'));
                    return tds.map(td => td.textContent.trim());
                });
            });

            rows.forEach(row => {
                let rowData = {};
                let skipRow = false; // Bandera para decidir si omitir la fila

                row.forEach((cell, index) => {

                    const header = headers[index].trim();

                    if (header.trim() !== '' && !header.startsWith('Agregar a favoritos')) {
                        rowData[cleanPropertyName(header)] = cell;
                    }

                    // Comprobar si la fila contiene alguna de las cadenas no deseadas
                    if (
                        cell.includes('Sistema de Consulta Web') ||
                        cell.includes('Ver todos los expedientes') ||
                        cell.includes('Ordenar Lista Por') ||
                        cell.includes('Ordenar') ||
                        (cell.trim() === '' && headers[index] === 'Expediente')
                    ) {
                        skipRow = true;
                    }
                });

                // Solo agregar la fila a 'data' si no contiene cadenas no deseadas
                if (!skipRow) {
                    data.push(rowData);
                }
            });

            console.log(`Primera fila, Expediente: ${rows[0][0]}, Última fila, Expediente: ${rows[rows.length - 1][0]}`);

            // Hacer clic en el siguiente control de paginación
            await expedientesPage.evaluate(index => {
                const paginationItems = Array.from(document.querySelectorAll('.pagination li'));
                if (index + 1 < paginationItems.length) {
                    const anchor = paginationItems[index + 1].querySelector('a'); // Ajustar el índice si es necesario
                    if (anchor) anchor.click();
                }
            }, i);

            await expedientesPage.waitForTimeout(3000); // Esperar un momento para que la página se cargue
        }

        console.log(data);

        console.log(`Cantidad total de objetos obtenidos: ${data.length}`);

    } catch (error) {
        console.error('Error: ', error);
    }

    //console.log(data); // mostrar la información extraída

    // Cerrar el navegador
    //await browser.close();
})();

function cleanPropertyName(name) {
    return name.replace(/[\.\s\'\`\~\!\@\#\$\%\^\&\*\(\)\-\+\=\{\[\}\]\|\\\;\"\<\>\?\,\/\:\“\”\‘\’]/g, "")
               .replace(/[áàäâ]/g, "a")
               .replace(/[éèëê]/g, "e")
               .replace(/[íìïî]/g, "i")
               .replace(/[óòöô]/g, "o")
               .replace(/[úùüû]/g, "u")
               .replace(/[ÁÀÄÂ]/g, "A")
               .replace(/[ÉÈËÊ]/g, "E")
               .replace(/[ÍÌÏÎ]/g, "I")
               .replace(/[ÓÒÖÔ]/g, "O")
               .replace(/[ÚÙÜÛ]/g, "U");
}