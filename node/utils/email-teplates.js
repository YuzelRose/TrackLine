import mjml2html from 'mjml';
import { TRACT_ORIGIN } from '../config.js';

export const TutorToStudentRegsiterTemplate = async (templateData) => {
    const MJML_TEMPLATE =
    `<mjml>
        <mj-head>
            <mj-title>Track-Line - Registro En Proceso</mj-title>
            <mj-preview>Bienvenido a Track-Line - Tu plataforma educativa</mj-preview>
            <mj-style>
            .text-primary { color: #2b6cb0 !important; }
            .text-secondary { color: #22543d !important; }
            .bg-primary { background-color: #2b6cb0 !important; }
            .bg-secondary { background-color: #c6f6d5 !important; }
            .bg-card { background-color: #e6f0fa !important; }
            .border-color { border-color: #cbd5e0 !important; }
            </mj-style>
        </mj-head>

        <mj-body background-color="#f0f4f8">
            <!-- Header -->
            <mj-section background-color="#060b41" padding="40px 0">
            <mj-column>
                <mj-text align="center" color="#ffffff" font-size="28px" font-weight="bold" font-family="Arial, sans-serif">
                Track-Line
                </mj-text>
                <mj-text align="center" color="#ebf8ff" font-size="16px" padding-top="10px">
                LA PLATAFORMA EDUCATIVA A TU SERVICIO
                </mj-text>
            </mj-column>
            </mj-section>

            <!-- Main Content -->
            <mj-section background-color="#ffffff" padding="40px 0">
            <mj-column>
                <mj-text color="#1a365d" font-size="24px" font-weight="bold" align="center" padding="0 0 20px 0">
                Confirmación de registro
                </mj-text>

                <mj-text color="#4a5568" font-size="16px" line-height="1.6" padding="10px 10px">
                Desde <strong style="color: #060b41;">Track-Line</strong> te deseamos lo mejor en tu <strong style="color: #060b41;">vía de estudio</strong>.
                </mj-text>

                <mj-text color="#4a5568" font-size="16px" line-height="1.6" padding="10px 5px">
                Te damos la bienvenida a <strong style="color: #060b41;">Track-Line</strong>. Su tutor ha registrado este correo. Para completar su registro, por favor utilice el enlace que se encuentra en la sección inferior.
                </mj-text>
                <mj-text color="#276749" font-size="16px" line-height="1.6" padding="10px 5px">
                <strong>Si su tutor no realizó este registro, ignore este correo.</strong>
                </mj-text>

                <!-- Info Card -->
                <mj-wrapper background-color="#e6f0fa" padding="20px" border="2px solid #cbd5e0" border-radius="8px">
                <mj-text color="#2d3748" font-size="14px" font-weight="bold" padding="0 0 10px 0">
                    Información Registrada:
                </mj-text>
                <mj-text color="#4a5568" font-size="14px" padding="5px 0">
                    • Correo: <strong>{{email}}</strong>
                </mj-text>
                <mj-text color="#4a5568" font-size="14px" padding="5px 0">
                    • Fecha de registro: <strong>{{fecha}}</strong>
                </mj-text>
                </mj-wrapper>
            </mj-column>
            </mj-section>

            <!-- CTA Section -->
            <mj-section background-color="#f0f4f8" padding="30px 0">
            <mj-column>
                <mj-button background-color="#3182ce" color="#ffffff" font-size="16px" font-weight="bold" border-radius="6px" padding="15px 30px" href="{{urlPlataforma}}">
                Terminar registro
                </mj-button>

                <mj-text color="#276749" font-size="12px" align="center" padding="15px 0 0 0">
                </mj-text>
            </mj-column>
            </mj-section>

            <!-- Features -->
            <mj-section background-color="#ffffff" padding="30px 0">
            <mj-column>
                <mj-text color="#1a365d" font-size="18px" font-weight="bold" align="center" padding="0 0 20px 0">
                ¿Qué puedes hacer en Track-Line?
                </mj-text>

                <mj-table padding="10px 0">
                <tr>
                    <td style="padding: 10px; text-align: center;">
                    <div style="color: #38a169; font-size: 24px;">📚</div>
                    <p style="color: #22543d; font-size: 14px; margin: 5px 0;">Acceder a cursos</p>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                    <div style="color: #3182ce; font-size: 24px;">🎯</div>
                    <p style="color: #2b6cb0; font-size: 14px; margin: 5px 0;">Seguir tu progreso</p>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                    <div style="color: #9ae6b4; font-size: 24px;">📊</div>
                    <p style="color: #276749; font-size: 14px; margin: 5px 0;">Ver calificaciones</p>
                    </td>
                </tr>
                </mj-table>
            </mj-column>
            </mj-section>

            <!-- Footer -->
            <mj-section background-color="#060b41" padding="30px 0">
            <mj-column>
                <mj-text color="#ebf8ff" font-size="14px" align="center" line-height="1.5">
                <strong>Track-Line</strong><br />
                Siguiendo tu aprendizaje para brindar orientación
                </mj-text>

                <mj-divider border-color="#2b6cb0" border-width="1px" padding="15px 0"></mj-divider>

                <mj-text color="#90cdf4" font-size="12px" align="center" line-height="1.4">
                Este es un mensaje automático. Por favor no respondas a este correo.<br />
                Si tienes alguna pregunta, contacta a nuestro equipo de soporte.
                </mj-text>

                <mj-text color="#63b3ed" font-size="11px" align="center" padding="15px 0 0 0">
                © 2025 Track-Line. Todos los derechos reservados.
                </mj-text>
            </mj-column>
            </mj-section>
        </mj-body>
    </mjml>`
    try {        
        const compiledMjml = MJML_TEMPLATE
            .replace(/{{email}}/g, templateData.email || 'trackline.edu@gmail.com')
            .replace(/{{fecha}}/g, new Date().toLocaleDateString())
            .replace(/{{urlPlataforma}}/g, `${TRACT_ORIGIN}/confirmar-registro/student-confirm?token=${templateData.token ?? 'error'}`
        )
        const { html, errors } = mjml2html(compiledMjml)
        if (errors?.length > 0) {
            console.warn('MJML errors:', errors)
        }
        return html
    } catch (error) {
        console.error('Error al compilar el template:', error)
        throw error
    }
}

export const RegsiterTemplate = async (templateData) => {
    const MJML_TEMPLATE =
    `<mjml>
        <mj-head>
            <mj-title>Track-Line - Registro En Proceso</mj-title>
            <mj-preview>Bienvenido a Track-Line - Tu plataforma educativa</mj-preview>
            <mj-style>
            .text-primary { color: #2b6cb0 !important; }
            .text-secondary { color: #22543d !important; }
            .bg-primary { background-color: #2b6cb0 !important; }
            .bg-secondary { background-color: #c6f6d5 !important; }
            .bg-card { background-color: #e6f0fa !important; }
            .border-color { border-color: #cbd5e0 !important; }
            </mj-style>
        </mj-head>

        <mj-body background-color="#f0f4f8">
            <!-- Header -->
            <mj-section background-color="#060b41" padding="40px 0">
            <mj-column>
                <mj-text align="center" color="#ffffff" font-size="28px" font-weight="bold" font-family="Arial, sans-serif">
                Track-Line
                </mj-text>
                <mj-text align="center" color="#ebf8ff" font-size="16px" padding-top="10px">
                LA PLATAFORMA EDUCATIVA A TU SERVICIO
                </mj-text>
            </mj-column>
            </mj-section>

            <!-- Main Content -->
            <mj-section background-color="#ffffff" padding="40px 0">
            <mj-column>
                <mj-text color="#1a365d" font-size="24px" font-weight="bold" align="center" padding="0 0 20px 0">
                Confirmación de registro <!-- Corrección: "Confirmacion" → "Confirmación" -->
                </mj-text>

                <mj-text color="#4a5568" font-size="16px" line-height="1.6" padding="10px 10px">
                Desde <strong style="color: #060b41;">Track-Line</strong> te deseamos lo mejor en tu <strong style="color: #060b41;">vía de estudio</strong>.
                </mj-text>

                <mj-text color="#4a5568" font-size="16px" line-height="1.6" padding="10px 5px">
                Te damos la bienvenida a <strong style="color: #060b41;">Track-Line</strong>. Su registro está en proceso. Para completarlo, por favor utilice el enlace que se encuentra en la sección inferior.
                </mj-text>
                <mj-text color="#276749" font-size="16px" line-height="1.6" padding="10px 5px">
                <strong>Si usted no realizó este registro, ignore este correo.</strong> <!-- Corrección: "tu no" → "usted no", "realizaste" → "realizó", falta coma -->
                </mj-text>

                <!-- Info Card -->
                <mj-wrapper background-color="#e6f0fa" padding="20px" border="2px solid #cbd5e0" border-radius="8px">
                <mj-text color="#2d3748" font-size="14px" font-weight="bold" padding="0 0 10px 0">
                    Información Registrada:
                </mj-text>
                <mj-text color="#4a5568" font-size="14px" padding="5px 0">
                    • Correo: <strong>{{email}}</strong>
                </mj-text>
                <mj-text color="#4a5568" font-size="14px" padding="5px 0">
                    • Fecha de registro: <strong>{{fecha}}</strong>
                </mj-text>
                </mj-wrapper>
            </mj-column>
            </mj-section>

            <!-- CTA Section -->
            <mj-section background-color="#f0f4f8" padding="30px 0">
            <mj-column>
                <mj-button background-color="#3182ce" color="#ffffff" font-size="16px" font-weight="bold" border-radius="6px" padding="15px 30px" href="{{urlPlataforma}}">
                Terminar registro
                </mj-button>

                <mj-text color="#276749" font-size="12px" align="center" padding="15px 0 0 0">
                </mj-text>
            </mj-column>
            </mj-section>

            <!-- Features -->
            <mj-section background-color="#ffffff" padding="30px 0">
            <mj-column>
                <mj-text color="#1a365d" font-size="18px" font-weight="bold" align="center" padding="0 0 20px 0">
                ¿Qué puedes hacer en Track-Line?
                </mj-text>

                <mj-table padding="10px 0">
                <tr>
                    <td style="padding: 10px; text-align: center;">
                    <div style="color: #38a169; font-size: 24px;">📚</div>
                    <p style="color: #22543d; font-size: 14px; margin: 5px 0;">Acceder a cursos</p>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                    <div style="color: #3182ce; font-size: 24px;">🎯</div>
                    <p style="color: #2b6cb0; font-size: 14px; margin: 5px 0;">Seguir tu progreso</p>
                    </td>
                    <td style="padding: 10px; text-align: center;">
                    <div style="color: #9ae6b4; font-size: 24px;">📊</div>
                    <p style="color: #276749; font-size: 14px; margin: 5px 0;">Ver calificaciones</p>
                    </td>
                </tr>
                </mj-table>
            </mj-column>
            </mj-section>

            <!-- Footer -->
            <mj-section background-color="#060b41" padding="30px 0">
            <mj-column>
                <mj-text color="#ebf8ff" font-size="14px" align="center" line-height="1.5">
                <strong>Track-Line</strong><br />
                Siguiendo tu aprendizaje para brindar orientación <!-- Corrección: "orientacion" → "orientación" -->
                </mj-text>

                <mj-divider border-color="#2b6cb0" border-width="1px" padding="15px 0"></mj-divider>

                <mj-text color="#90cdf4" font-size="12px" align="center" line-height="1.4">
                Este es un mensaje automático. Por favor no respondas a este correo.<br />
                Si tienes alguna pregunta, contacta a nuestro equipo de soporte.
                </mj-text>

                <mj-text color="#63b3ed" font-size="11px" align="center" padding="15px 0 0 0">
                © 2025 Track-Line. Todos los derechos reservados.
                </mj-text>
            </mj-column>
            </mj-section>
        </mj-body>
    </mjml>`
    try {        
        const compiledMjml = MJML_TEMPLATE
            .replace(/{{email}}/g, templateData.email || 'trackline.edu@gmail.com')
            .replace(/{{fecha}}/g, new Date().toLocaleDateString())
            .replace(/{{urlPlataforma}}/g, `${TRACT_ORIGIN}/confirmar-registro?token=${templateData.token ?? 'error'}`
        )
        const { html, errors } = mjml2html(compiledMjml)
        if (errors?.length > 0) {
            console.warn('MJML errors:', errors)
        }
        return html;
    } catch (error) {
        console.error('Error al compilar el template:', error)
        throw error;
    }
}