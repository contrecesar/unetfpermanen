const costCategories = {
    cat1: [
        { id: 'insumos', name: 'Insumos (Fijo)', value: 0.00 },
        { id: 'alquiler', name: 'Alquiler de Local (Fijo)', value: 0.00 },
        { id: 'logistica', name: 'Personal de Logística (Fijo)', value: 0.00 },
        { id: 'apoyo', name: 'Personal Apoyo (Bono 5% HP) (Fijo)', value: 0.00 },
        { id: 'plataforma', name: 'Uso de Plataforma Digital (Fijo)', value: 0.00 },
        { id: 'certificados', name: 'Certificados (Variable)', value: 5.00 },
        { id: 'disco', name: 'Disco con Presentación (Variable)', value: 0.00 },
        { id: 'didactico', name: 'Material Didáctico (Variable)', value: 0.00 },
        { id: 'fabricacion', name: 'Materiales de Fabricación (Variable)', value: 0.00 },
        { id: 'transporte', name: 'Transporte (Variable)', value: 0.00 },
        { id: 'acto', name: 'Acto de Grado (Variable)', value: 0.00 },
        { id: 'iso9001', name: 'Norma ISO 9001:2008 (Electrónico) (Variable)', value: 0.00 }
    ],
    cat2: [
        { id: 'mantenimiento', name: 'Mantenimiento Instalaciones', value: 0.00 },
        { id: 'videobeam', name: 'Video Beam', value: 0.00 },
        { id: 'mobiliario', name: 'Reposición Mobiliario', value: 0.00 },
        { id: 'servicios', name: 'Servicios Básicos', value: 0.00 }
    ],
    cat3: [
        { id: 'carpetas', name: 'Carpetas Facilitador', value: 0.00 },
        { id: 'marcador', name: 'Marcador de Pizarra', value: 0.00 },
        { id: 'borrador', name: 'Borrador', value: 0.00 },
        { id: 'fotocopiadora', name: 'Servicio Fotocopiadora', value: 0.00 },
        { id: 'tirro', name: 'Cinta Adhesiva (Tirro)', value: 0.00 }
    ],
    cat4: [
        { id: 'iso19011', name: 'Norma ISO 19011:2003 (Electrónico)', value: 0.00 },
        { id: 'libreta', name: 'Libreta/Hojas de notas', value: 0.00 },
        { id: 'coordinador', name: 'Coordinador de Núcleo', value: 0.00 },
        { id: 'thielen', name: 'Porcentaje Sala Thielen', value: 0.00 },
        { id: 'disenador', name: 'Costo Diseñador Gráfico', value: 1.71 },
        { id: 'publicidad', name: 'Publicidad del Curso', value: 0.00 }
    ],
    cat5: [
        { id: 'hospedaje', name: 'Hospedaje Facilitador (Hotel/Posada + Desayuno)', value: 0.00 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    renderCostItems();
    initAccordions();
    setupEventListeners();
    calculate();
});

function renderCostItems() {
    for (const [cat, items] of Object.entries(costCategories)) {
        const container = document.getElementById(`${cat}-items`);
        if (!container) continue;
        container.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cost-item-row';
            row.innerHTML = `
                <span>${item.name}</span>
                <input type="number" data-cat="${cat}" data-id="${item.id}" value="${item.value.toFixed(2)}" step="0.01">
            `;
            container.appendChild(row);
        });
    }
}

function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            accordion.classList.toggle('active');
        });
    });
}

function setupEventListeners() {
    // Basic inputs and exchange rates
    ['numParticipants', 'numHours', 'facilitatorRate', 'numNights', 'rateCOP', 'rateBS', 'utilityPercent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculate);
    });

    // Cost inputs (use event delegation for better reliability)
    document.addEventListener('input', (e) => {
        if (e.target.matches('.cost-item-row input')) {
            const cat = e.target.dataset.cat;
            const id = e.target.dataset.id;
            const value = parseFloat(e.target.value) || 0;

            // Update data structure
            const item = costCategories[cat].find(i => i.id === id);
            if (item) item.value = value;

            calculate();
        }
    });

    const btnReport = document.getElementById('btnGenerateReport');
    if (btnReport) btnReport.addEventListener('click', generateReport);
}

function calculate() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value) || 0;

    const n = parseInt(document.getElementById('numParticipants')?.value) || 0;
    const H = parseInt(document.getElementById('numHours')?.value) || 0;
    const T = getVal('facilitatorRate');
    const noches = parseInt(document.getElementById('numNights')?.value) || 0;
    const utility = getVal('utilityPercent');
    const rateCOP = getVal('rateCOP');
    const rateBS = getVal('rateBS');

    // Cat 1: (Sum Cat 1 items) * n
    const sumCat1 = costCategories.cat1.reduce((sum, item) => sum + item.value, 0);
    const totalCat1 = sumCat1 * n;
    document.getElementById('total-cat1').textContent = `$${totalCat1.toFixed(2)}`;

    // Cat 2: (Sum Cat 2 items) * H
    const sumCat2 = costCategories.cat2.reduce((sum, item) => sum + item.value, 0);
    const totalCat2 = sumCat2 * H;
    document.getElementById('total-cat2').textContent = `$${totalCat2.toFixed(2)}`;

    // Cat 3: Global Sum
    const totalCat3 = costCategories.cat3.reduce((sum, item) => sum + item.value, 0);
    document.getElementById('total-cat3').textContent = `$${totalCat3.toFixed(2)}`;

    // Cat 4: Global Sum
    const totalCat4 = costCategories.cat4.reduce((sum, item) => sum + item.value, 0);
    document.getElementById('total-cat4').textContent = `$${totalCat4.toFixed(2)}`;

    // Cat 5: Costo Noche * Noches
    const costoNoche = costCategories.cat5[0].value;
    const totalCat5 = costoNoche * noches;
    document.getElementById('total-cat5').textContent = `$${totalCat5.toFixed(2)}`;

    // OCF = Total categories
    const ocf = totalCat1 + totalCat2 + totalCat3 + totalCat4 + totalCat5;
    document.getElementById('res-ocf').textContent = `$${ocf.toFixed(2)}`;

    // HF = (T * n) + (0.10 * T) * H
    const hf = (T * n) + (0.10 * T) * H;
    document.getElementById('res-hf').textContent = `$${hf.toFixed(2)}`;

    // SCU = (HF + OCF) * (1 + utility/100)
    const scu = (hf + ocf) * (1 + utility / 100);
    document.getElementById('res-scu').textContent = `$${scu.toFixed(2)}`;

    // PVS = SCU / (0.65 * n)
    const pvs = n > 0 ? scu / (0.65 * n) : 0;
    document.getElementById('res-pvs').textContent = `$${pvs.toFixed(2)}`;

    // Ingreso Neto Total = PVS * n
    const netIncome = pvs * n;
    document.getElementById('res-net').textContent = `$${netIncome.toFixed(2)}`;

    // Listeners for new employee input
    document.getElementById('employeeName').addEventListener('input', calculate);

    // Currency Conversions
    const updateConv = (id, val, rate, suffix) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${(val * rate).toLocaleString('es-CO')} ${suffix}`;
    };

    updateConv('res-pvs-cop', pvs, rateCOP, 'COP');
    updateConv('res-pvs-bs', pvs, rateBS, 'Bs.');
    updateConv('res-net-cop', netIncome, rateCOP, 'COP');
    updateConv('res-net-bs', netIncome, rateBS, 'Bs.');
    updateConv('res-scu-cop', scu, rateCOP, 'COP');
    updateConv('res-scu-bs', scu, rateBS, 'Bs.');

    // Retentions (on SCU)
    const retAnticipo = scu/.65 * 0.20;
    const retBono = scu/.65 * 0.15;
    document.getElementById('ret-anticipo').textContent = `$${retAnticipo.toFixed(2)}`;
    document.getElementById('ret-bono').textContent = `$${retBono.toFixed(2)}`;
}

function generateReport() {
    const reportTemplate = document.getElementById('report-template');
    const courseName = document.getElementById('courseName').value || 'S/N';
    const facilitatorName = document.getElementById('facilitatorName').value || 'S/N';
    const employeeName = document.getElementById('employeeName').value || 'S/N';
    const n = document.getElementById('numParticipants').value;
    const H = document.getElementById('numHours').value;

    let costsHtml = '';
    for (const [cat, items] of Object.entries(costCategories)) {
        costsHtml += `<h3>${cat.toUpperCase()}</h3><table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">`;
        items.forEach(item => {
            costsHtml += `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">${item.name}</td><td style="padding: 8px; text-align: right;">$${item.value.toFixed(2)}</td></tr>`;
        });
        costsHtml += `</table>`;
    }

    reportTemplate.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px;">
                <img src="logo-unet_con_texto_azul.png" style="max-height: 70px;">
                <div style="text-align: center; flex: 1;">
                    <h2 style="margin: 0; color: #1e293b; font-size: 1.2rem;">Coordinación de Formación Permanente</h2>
                    <h1 style="color: #4f46e5; margin: 5px 0; font-size: 1.5rem;">Informe de Estructura de Costos</h1>
                    <p style="margin: 0; font-size: 0.9rem;">Análisis de Precio de Venta Sugerido (PVS)</p>
                </div>
                <img src="LOGO-EXTENSION transparente.png" style="max-height: 70px;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; font-size: 0.95rem;">
                <div><strong>Curso:</strong> ${courseName}</div>
                <div><strong>Facilitador:</strong> ${facilitatorName}</div>
                <div><strong>Elaborado por:</strong> ${employeeName}</div>
                <div><strong>Participantes (n):</strong> ${n} | <strong>Horas (H):</strong> ${H}</div>
            </div>

            <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Desglose de Costos</h2>
            ${costsHtml}

            <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 40px;">Resultados Finales</h2>
            <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 1.1rem;">
                    <span>Honorarios Facilitador (HF):</span>
                    <strong>${document.getElementById('res-hf').textContent}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 1.1rem;">
                    <span>Otros Costos (OCF):</span>
                    <strong>${document.getElementById('res-ocf').textContent}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 10px; margin-bottom: 10px; font-size: 1.2rem;">
                    <span>Suma de Costos Unitarios (SCU):</span>
                    <strong>${document.getElementById('res-scu').textContent}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: bold; margin-top: 10px;">
                    <span>PVS Final (por persona):</span>
                    <span>${document.getElementById('res-pvs').textContent}</span>
                </div>
                <div style="text-align: right; font-size: 1rem; opacity: 1; margin-top: 5px; color: white;">
                    ${document.getElementById('res-pvs-cop').textContent} | ${document.getElementById('res-pvs-bs').textContent}
                </div>
            </div>

            <div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: bold;">
                    <span>Ingreso Neto Total:</span>
                    <span>${document.getElementById('res-net').textContent}</span>
                </div>
                <div style="text-align: right; font-size: 1rem; opacity: 1; margin-top: 5px; color: white;">
                    ${document.getElementById('res-net-cop').textContent} | ${document.getElementById('res-net-bs').textContent}
                </div>
            </div>

            <div style="margin-top: 30px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                <h3 style="margin-top: 0;">Retenciones Proyectadas</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Fondo de Anticipo (20%):</span>
                    <span>${document.getElementById('ret-anticipo').textContent}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Bono Productividad (12%):</span>
                    <span>${document.getElementById('ret-bono').textContent}</span>
                </div>
            </div>

            <div style="margin-top: 50px; text-align: center; font-size: 0.8rem; color: #999;">
                Generado automáticamente por el Sistema de Gestión de Costo de la Coordinación de Formación Permanente - ${new Date().toLocaleDateString()}
            </div>
        </div>
    `;

    window.print();
}
