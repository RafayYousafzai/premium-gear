import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProgressBar from '../components/ProgressBar'; // Assuming you have the ProgressBar component
import './styles/AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-page">
            <Header />
            <ProgressBar />
            <div className="about-us-content">
                <h1>Proceso Premium Gear</h1> {/* Added Heading */}
                <div className="video-section">
                    <video src={`${process.env.PUBLIC_URL}/assets/video.mp4`} className="warranty-video" controls />
                </div>

                <section className="one-year-warranty">
                    <h2>GARANTÍA MÍNIMA DE 1 AÑO</h2>
                    <p>Absolutamente todos nuestros vehículos vienen con garantía mínima de 1 año incluida en el precio.</p>
                </section>

                <section className="covered-parts">
                    <h2>PIEZAS CUBIERTAS*</h2>
                    <table className="covered-parts-table">
                        <tbody>
                            <tr>
                                <th>Motor:</th>
                                <td>Árbol de levas, Bielas, Bloque, Bomba de aceite, Bulones, Camisas de Pistón, Cigüeñal, Cilindros, Culata, Junta de Culata, Pistones, Segmentos, Válvulas admisión / escape.</td>
                            </tr>
                            <tr>
                                <th>Caja de cambio:</th>
                                <td>Árboles, Convertidor de par, Distribuidor de Cambio Automático, Horquillas, Ejes, Bloque de válvulas, Engranajes / Piñones, Primario / Tren fijo, Sincronizadores.</td>
                            </tr>
                            <tr>
                                <th>Diferencial:</th>
                                <td>Corona, Piñón de ataque, Planetario, Satélites.</td>
                            </tr>
                            <tr>
                                <th>Sistema de dirección:</th>
                                <td>Bomba de aceite, Caja dirección, Cremallera.</td>
                            </tr>
                            <tr>
                                <th>Embrague:</th>
                                <td>Bomba, Bombines, Eje, Horquilla, Plato de presión, Rodamiento.</td>
                            </tr>
                            <tr>
                                <th>Frenos:</th>
                                <td>ABS (exclusivamente centralita), Bomba de freno, Bomba de vacío, Bombines, Cilindro maestro, Servofreno.</td>
                            </tr>
                            <tr>
                                <th>Aire acondicionado / Climatizador:</th>
                                <td>Compresor, Condensador, Evaporador, Módulo de mando electrónico.</td>
                            </tr>
                            <tr>
                                <th>Circuito de refrigeración:</th>
                                <td>Bomba de agua, Motoventilador y centrífugo (viscoso), Electroventilador, Ventilador centrífugo, Radiador, Radiador enfriador de aceite, Termostato.</td>
                            </tr>
                            <tr>
                                <th>Circuito de alimentación:</th>
                                <td>Aforador de combustible, Bomba combustible, Bomba inyectora, Intercooler, Regulador presión carburante, Inyectores (solo se garantiza reparación, queda excluida la limpieza o la sustitución), Turbocompresor, Caja de mariposas sistema de alimentación (excluidas las mariposas del colector, caja de mariposas del colector o actuador de mariposas).</td>
                            </tr>
                            <tr>
                                <th>Sistema eléctrico:</th>
                                <td>Bobina de encendido, Bote de intermitencias, Centralita/c. Centralizado, Dosificador/calculador inyección, Alternador, Módulo de encendido, Motor de arranque, Motor calefacción, Motor elevalunas, Motor lavaparabrisas, Motor limpiaparabrisas luneta, Motor ventilación, Motores cierre centralizado.</td>
                            </tr>
                            <tr>
                                <th>Suspensión:</th>
                                <td>Barra estabilizadora, Barras de torsión, Rótulas.</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="disclaimer">*Estas coberturas pueden sufrir variaciones en función del modelo. En algunos casos se podrá solicitar la ampliación del listado de coberturas bajo aprobación previa de nuestra aseguradora externa.</p>
                </section>

                <section className="additional-warranty">
                    <h2>¿1 AÑO NO TE PARECE SUFICIENTE PROTECCIÓN?</h2>
                    <p>Podemos negociar por ti la ampliación del periodo de garantía y ofrecerte presupuesto sin compromiso.</p>
                    <div className="warranty-offered">
                        <h3>GARANTÍA OFRECIDA POR</h3>
                        <img src={`${process.env.PUBLIC_URL}/assets/tech.svg`} alt="Tech Logo" className="warranty-logo" />
                        <p>La garantía se tramita directamente con la aseguradora, sin necesidad de pasar por nosotros. El día de la venta te entregaremos toda la información para que sepas cómo poder disfrutar de esta protección en caso de que sea necesario.</p>
                    </div>
                </section>

                {/* GARANTÍA DE DEVOLUCIÓN Section */}
                <section className="return-warranty">
                    <h2>GARANTÍA DE DEVOLUCIÓN*</h2> {/* Moved the asterisk here */}
                    <p className="sub-text">15 DÍAS O 500KM (Lo que antes se cumpla)</p>

                    <div className="warranty-application">
                        <h3>APLICABLE PARA:</h3>
                        <ul>
                            <li>Aparición de defectos y averías nuevas, no manifestadas en la información aportada sobre el coche, ni visualizados el día de la entrega y que no estén cubiertos por la garantía mecánica asociada.</li>
                            <li>Diferencias fuera de la normalidad, significativas y justificadas entre las especificaciones técnicas y el rendimiento real del vehículo (Mediciones en bancos de potencia, etc.).</li>
                            <li>Datos de la descripción del vehículo incorrectos:
                                <ul>
                                    <li>Color diferente al anunciado.</li>
                                    <li>Fotos no coinciden.</li>
                                    <li>Estado no coincide.</li>
                                    <li>Ausencia de equipamiento manifestado.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <hr className="section-divider" />

                    <div className="warranty-exclusions">
                        <h3>MOTIVOS DE EXCLUSIÓN DE ESTA GARANTÍA:</h3>
                        <ul>
                            <li>Averías o defectos cubiertos por la garantía asociada.</li>
                            <li>Vehículos accidentados.</li>
                            <li>Coche dañado mecánica o estéticamente por el comprador tras la entrega.</li>
                            <li>Manipulación del vehículo NO autorizada, incluyendo reprogramaciones o daños producidos por máquinas de diagnóstico (modificación de datos, lecturas erróneas, centralitas dañadas, etc.).</li>
                            <li>Indicios de manipulación o sustitución de cualquier pieza o software original del vehículo.</li>
                            <li>Pérdida del derecho de reparación o anulación de la garantía tras no seguir expresamente las instrucciones de la póliza o las indicaciones de la empresa externa de garantías; asociada la no cobertura de una avería directamente con el dolo del comprador.</li>
                            <li>Defectos estéticos o mecánicos cuya reparación no supere los 1000€ y que estén directamente asociados a un mal proceso de información preventa por parte de la empresa. Ante esta situación, Premium Gear se reserva el derecho de hacerse cargo de la reparación, quedando anulada la garantía de devolución tras la solventación del problema por la misma.</li>
                        </ul>
                        <p className="disclaimer">*Esta garantía sólo es aplicable a vehículos procedentes de Stock, quedando los vehículos por encargo excluidos de ella, pero sí cubiertos por nuestra garantía estándar.</p>
                    </div>
                </section>

                {/* Legal and Return Policies Section */}
                <section className="legal-return-policies">
                    <h3>Política de Devolución y Condiciones Legales</h3>
                    <p>Premium Gear se reserva el derecho de emprender acciones legales contra quien use estas garantías con mala fé o intención manifiesta de realizar la compra para causar dolosamente perjuicio a la empresa, modificando o desguazando cualquier vehículo para su posterior devolución.</p>
                    <p>Todos los vehículos procedentes de devolución pasarán una exhaustiva inspección en centros especializados para determinar que no han sido manipulados.</p>
                    <p>Una vez revisados, se procederá a la devolución del dinero, deduciendo del importe total a devolver el coste de la revisión, el traslado a su domicilio (si lo ha habido), el traslado posterior a nuestro garaje, los gastos de limpieza, el importe de la póliza de garantía asociada al vehículo (que pagamos nosotros tras cada venta) y los gastos del trámite de cambio de nombre (si los hubiera).</p>
                    <p>La devolución se realizará en forma de transferencia bancaria, en la cuenta que el cliente especifique. De igual forma, se podrá descontar este importe de la compra de otro vehículo si así lo decidiera el cliente, calculando la diferencia de precio, y abonándose la diferencia.</p>
                    <p>La empresa se reserva el derecho de poder aplicar promociones extraordinarias para clientes que en vez de realizar una devolución prefieran realizar un cambio por otro vehículo en stock.</p>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUs;
