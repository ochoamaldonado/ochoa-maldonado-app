import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════
//  BRAND TOKENS — Ochoa Maldonado & Abogados S. Civil
// ══════════════════════════════════════════════════════════════
const B = {
  bg:       "#f5ede0",          // crema cálida — fondo principal
  card:     "#fffaf4",          // blanco marfil — card
  border:   "#d4b896",          // borde beige medio
  border2:  "#e8d8c4",          // borde sutil
  brown1:   "#6b3a1f",          // marrón medio
  brown2:   "#3d2010",          // marrón oscuro logo
  gold:     "#8a5c2e",          // marrón dorado — acento principal
  goldL:    "#5c3310",          // marrón oscuro — títulos
  goldD:    "#c8a882",          // beige logo — decorativo
  text:     "#2a1a0a",          // casi negro cálido — texto principal
  textMid:  "#5a3a20",          // marrón medio — texto secundario
  textDim:  "#9a7a58",          // marrón claro — texto tenue
  green:    "#1a7a3a",
  yellow:   "#a06010",
  red:      "#b03020",
  blue:     "#1a50a0",
  purple:   "#6a30a0",
};

const COMPLEJIDAD_CFG = {
  simple:   { label:"Respuesta Inmediata",  time:"⚡ Instantánea",    color:B.green,  bg:`${B.green}15`,  glow:`${B.green}30` },
  moderada: { label:"Respuesta Rápida",     time:"⏱ Máx. 2 horas",   color:B.yellow, bg:`${B.yellow}15`, glow:`${B.yellow}30` },
  compleja: { label:"Análisis Detallado",   time:"📋 Máx. 6 horas",   color:B.red,    bg:`${B.red}15`,    glow:`${B.red}30` },
};

const MAX_PALABRAS = 300;

// ══════════════════════════════════════════════════════════════
//  DATOS
// ══════════════════════════════════════════════════════════════
const TARIFARIO_CONSULTAS = [
  { id:"alimentos",area:"Alimentos",precio:12,icon:"👨‍👩‍👧",complejidad:"simple",
    desc:"Pensión, devengados, reducción, aumento.",
    faqs:["¿Cómo calculo el porcentaje de pensión?","Mi ex no paga hace 3 meses, ¿qué hago?","¿Puedo reducir la pensión si perdí trabajo?","¿Hasta qué edad se paga pensión a los hijos?"] },
  { id:"familia",area:"Familia",precio:29.90,icon:"🏠",complejidad:"moderada",
    desc:"Divorcio, tenencia, visitas, violencia familiar.",
    faqs:["¿Cuánto demora un divorcio por causal?","¿Cómo obtengo tenencia con violencia familiar?","Mi pareja no me deja ver mis hijos.","¿Qué es el régimen de visitas?"] },
  { id:"laboral",area:"Laboral",precio:25,icon:"⚖️",complejidad:"moderada",
    desc:"Despido arbitrario, CTS, vacaciones, hostigamiento.",
    faqs:["Me despidieron sin causa, ¿cuánto me deben?","¿Cuándo depositan la CTS?","Me dieron renuncia forzada, ¿es legal?","Mi empleador no paga vacaciones."] },
  { id:"penal",area:"Penal",precio:45,icon:"🔒",complejidad:"compleja",
    desc:"Delitos, medidas cautelares, antecedentes.",
    faqs:["Me denunciaron por violencia familiar.","¿Cómo cancelo mis antecedentes penales?","Me citaron como investigado, ¿qué hago?","¿Diferencia entre detención y prisión preventiva?"] },
  { id:"societario",area:"Societario",precio:50,icon:"🏢",complejidad:"compleja",
    desc:"Empresas, juntas, socios, responsabilidad.",
    faqs:["¿SAC, EIRL o SRL? ¿Cuál me conviene?","Un socio quiere salir, ¿cómo valoro su parte?","¿Cómo cambio al gerente?","Tengo deudas, ¿respondo con bienes personales?"] },
  { id:"civil",area:"Civil",precio:35,icon:"📄",complejidad:"moderada",
    desc:"Contratos, obligaciones, prescripción, nulidad.",
    faqs:["Firmé un contrato que no puedo cumplir.","Me vendieron inmueble con vicios ocultos.","¿Cuánto tiempo para cobrar una deuda?","¿Cómo anulo contrato firmado bajo engaño?"] },
  { id:"sucesiones",area:"Sucesiones",precio:39.90,icon:"📜",complejidad:"moderada",
    desc:"Testamentos, herencias, partición.",
    faqs:["Mi padre murió sin testamento, ¿qué hago?","¿Puedo desheredar a un hijo en Perú?","Un heredero no quiere repartir, ¿qué hago?","¿Cómo hago sucesión intestada notarial?"] },
  { id:"administrativo",area:"Administrativo",precio:30,icon:"🏛️",complejidad:"moderada",
    desc:"SUNAFIL, INDECOPI, municipalidades.",
    faqs:["SUNAFIL me multó, ¿puedo apelar?","La municipalidad clausuró mi local.","¿Cómo presento recurso de apelación?","Me negaron una licencia sin justificación."] },
  { id:"inmobiliario",area:"Inmobiliario",precio:40,icon:"🏗️",complejidad:"moderada",
    desc:"Desalojo, prescripción adquisitiva, compraventa.",
    faqs:["Mi inquilino no paga, ¿cómo lo desalojo?","Vivo 15 años en terreno ajeno, ¿puedo ganar la propiedad?","¿Qué revisar antes de comprar inmueble?","Me vendieron casa con hipoteca oculta."] },
  { id:"tributario",area:"Tributario",precio:45,icon:"📊",complejidad:"compleja",
    desc:"SUNAT, fiscalizaciones, multas, fraccionamiento.",
    faqs:["SUNAT me fiscaliza, ¿qué derechos tengo?","¿Puedo fraccionar deuda tributaria?","¿Cómo impugno una multa de SUNAT?","¿RUS, RER o Régimen General?"] },
  { id:"consumidor",area:"Protección al Consumidor",precio:25,icon:"🛡️",complejidad:"moderada",
    desc:"Reclamos ante INDECOPI, productos defectuosos, servicios incumplidos, publicidad engañosa.",
    faqs:["Me vendieron un producto defectuoso, ¿qué hago?","Una empresa no cumplió el servicio que pagué.","¿Cómo presento un reclamo ante INDECOPI?","Me cobraron de más en mi tarjeta, ¿puedo reclamar?","Una aerolínea canceló mi vuelo, ¿qué derechos tengo?"] },
  { id:"datos",area:"Protección de Datos Personales",precio:30,icon:"🔏",complejidad:"moderada",
    desc:"Uso indebido de datos, deuda en centrales de riesgo, derechos ARCO, INFOCORP.",
    faqs:["Aparezco en INFOCORP pero ya pagué mi deuda, ¿qué hago?","Una empresa usa mis datos sin mi autorización.","¿Cómo ejerzo mis derechos ARCO ante una empresa?","Me llaman constantemente por una deuda que no es mía.","¿Puedo pedir que eliminen mis datos de una base de datos?"] },
  { id:"deudas",area:"Cobro y Defensa de Deudas",precio:35,icon:"💳",complejidad:"moderada",
    desc:"Recuperar deudas impagas, oponerse a cobros indebidos, acuerdos de pago, pagarés.",
    faqs:["Me deben dinero y no me pagan, ¿cómo cobro?","Tengo una deuda que no reconozco, ¿cómo la refuto?","¿Qué es un proceso de ejecución de garantías?","Firmé un pagaré y no puedo pagar, ¿qué pasa?","¿Puedo llegar a un acuerdo de pago con mi acreedor?"] },
];

const ESCRITOS = [
  { id:"demanda_alimentos",nombre:"Demanda de Alimentos",precio:80,icon:"👨‍👩‍👧",campos:["nombre_demandante","nombre_demandado","nombre_hijo","edad_hijo","monto_solicitado","juzgado_destino"] },
  { id:"apelacion",nombre:"Recurso de Apelación",precio:90,icon:"📋",campos:["expediente","juzgado","fecha_resolucion","fundamentos"] },
  { id:"denuncia_penal",nombre:"Denuncia Penal",precio:75,icon:"🚨",campos:["denunciante","denunciado","hechos","fecha_hechos","pruebas"] },
  { id:"carta_notarial",nombre:"Carta Notarial",precio:50,icon:"✉️",campos:["remitente","destinatario","asunto","contenido","plazo_respuesta"] },
  { id:"demanda_laboral",nombre:"Demanda Laboral",precio:100,icon:"⚖️",campos:["trabajador","empleador","cargo","beneficios_reclamados","monto_total"] },
  { id:"contestacion",nombre:"Contestación de Demanda",precio:85,icon:"📝",campos:["expediente","juzgado","demandante","hechos_a_contestar","fundamentos_defensa"] },
  { id:"medida_cautelar",nombre:"Solicitud Medida Cautelar",precio:95,icon:"🔐",campos:["expediente","tipo_medida","bien_afectado","fundamentos"] },
  { id:"recurso_casacion",nombre:"Recurso de Casación",precio:120,icon:"⚡",campos:["expediente","sala","causal_casacion","fundamentos_juridicos"] },
];

const CONTRATOS = [
  { id:"arrend_viv",nombre:"Arrendamiento de Vivienda",precio:50,cat:"civil",icon:"🏠",campos:["arrendador","arrendatario","direccion_inmueble","monto_mensual","duracion_meses","fecha_inicio","garantia_meses"] },
  { id:"arrend_com",nombre:"Arrendamiento Comercial",precio:50,cat:"civil",icon:"🏪",campos:["arrendador","arrendatario","direccion_local","rubro_negocio","monto_mensual","duracion_meses","garantia"] },
  { id:"cv_inmueble",nombre:"Compraventa de Inmueble",precio:50,cat:"civil",icon:"🏡",campos:["vendedor","comprador","descripcion_inmueble","partida_registral","precio_venta","forma_pago","fecha_entrega"] },
  { id:"cv_plazos",nombre:"Compraventa Inmueble a Plazos",precio:50,cat:"civil",icon:"📅",campos:["vendedor","comprador","descripcion_inmueble","precio_total","cuota_inicial","cuotas","monto_cuota","fecha_inicio"] },
  { id:"arras_conf",nombre:"Arras Confirmatorias",precio:50,cat:"civil",icon:"🤝",campos:["comprador","vendedor","descripcion_bien","precio_total","monto_arras","plazo_escritura","penalidad"] },
  { id:"arras_pen",nombre:"Arras Penitenciales",precio:50,cat:"civil",icon:"🔖",campos:["comprador","vendedor","descripcion_bien","precio_total","monto_arras","plazo_escritura","quien_puede_desistir"] },
  { id:"arras_ret",nombre:"Arras Retractatorias",precio:50,cat:"civil",icon:"↩️",campos:["comprador","vendedor","descripcion_bien","precio_total","monto_arras","plazo_retracto"] },
  { id:"cv_mueble",nombre:"Compraventa Bien Mueble",precio:50,cat:"civil",icon:"📦",campos:["vendedor","comprador","descripcion_bien","precio","forma_entrega","garantia_meses"] },
  { id:"mutuo",nombre:"Contrato de Mutuo (Préstamo)",precio:50,cat:"civil",icon:"💰",campos:["prestamista","prestatario","monto","interes_mensual","plazo_meses","fecha_desembolso","garantia"] },
  { id:"comodato",nombre:"Comodato (Uso gratuito)",precio:50,cat:"civil",icon:"🔑",campos:["comodante","comodatario","descripcion_bien","duracion","condiciones_devolucion"] },
  { id:"ct_fijo",nombre:"Contrato Trabajo Plazo Fijo",precio:50,cat:"laboral",icon:"👷",campos:["empleador","trabajador","cargo","remuneracion","fecha_inicio","fecha_fin","causa_objetiva"] },
  { id:"ct_indef",nombre:"Contrato Trabajo Indeterminado",precio:50,cat:"laboral",icon:"👔",campos:["empleador","trabajador","cargo","remuneracion","fecha_inicio","lugar_trabajo","horario"] },
  { id:"locacion",nombre:"Locación de Servicios (RxH)",precio:50,cat:"laboral",icon:"🧾",campos:["comitente","locador","servicio","honorario_mensual","duracion","forma_pago"] },
  { id:"sac",nombre:"Minuta Constitución SAC",precio:200,cat:"societario",icon:"🏢",campos:["razon_social","socios","aportes","objeto_social","domicilio","gerente","capital_social"] },
  { id:"eirl",nombre:"Minuta Constitución EIRL",precio:200,cat:"societario",icon:"🏭",campos:["titular","razon_social","objeto_social","domicilio","capital_inicial","gerente"] },
  { id:"pacto",nombre:"Pacto de Socios/Accionistas",precio:100,cat:"societario",icon:"🤝",campos:["socios","porcentajes","distribucion_utilidades","causales_exclusion","derecho_preferencia"] },
  { id:"acta",nombre:"Acta de Junta de Accionistas",precio:100,cat:"societario",icon:"📋",campos:["empresa","fecha_junta","socios_asistentes","agenda","acuerdos","presidente_junta"] },
  { id:"cesion",nombre:"Cesión de Acciones",precio:100,cat:"societario",icon:"🔄",campos:["cedente","cesionario","empresa","numero_acciones","porcentaje","precio_cesion","fecha"] },
];

const CAT_LABELS = { civil:"Civil / Inmobiliario", laboral:"Laboral", societario:"Societario" };
const CAT_COLORS = { civil:B.blue, laboral:B.green, societario:B.purple };

const LABELS_MAP = {
  nombre_demandante:"Nombre del demandante",nombre_demandado:"Nombre del demandado",nombre_hijo:"Nombre del menor",edad_hijo:"Edad del menor",monto_solicitado:"Monto solicitado (S/)",juzgado_destino:"Juzgado de destino",expediente:"N° de expediente",juzgado:"Juzgado",fecha_resolucion:"Fecha de resolución",fundamentos:"Fundamentos",denunciante:"Nombre del denunciante",denunciado:"Nombre del denunciado",hechos:"Descripción de los hechos",fecha_hechos:"Fecha de los hechos",pruebas:"Pruebas disponibles",remitente:"Remitente",destinatario:"Destinatario",asunto:"Asunto",contenido:"Contenido / pretensión",plazo_respuesta:"Plazo de respuesta (días)",trabajador:"Nombre del trabajador",empleador:"Nombre del empleador",cargo:"Cargo",beneficios_reclamados:"Beneficios que reclama",monto_total:"Monto total (S/)",hechos_a_contestar:"Hechos a contestar",fundamentos_defensa:"Fundamentos de defensa",tipo_medida:"Tipo de medida cautelar",bien_afectado:"Bien afectado",causal_casacion:"Causal de casación",fundamentos_juridicos:"Fundamentos jurídicos",arrendador:"Nombre del arrendador",arrendatario:"Nombre del arrendatario",direccion_inmueble:"Dirección del inmueble",monto_mensual:"Renta mensual (S/)",duracion_meses:"Duración (meses)",fecha_inicio:"Fecha de inicio",garantia_meses:"Meses de garantía",rubro_negocio:"Rubro del negocio",garantia:"Garantía (S/)",direccion_local:"Dirección del local",vendedor:"Nombre del vendedor",comprador:"Nombre del comprador",descripcion_inmueble:"Descripción del inmueble",partida_registral:"Partida registral (SUNARP)",precio_venta:"Precio de venta (S/)",forma_pago:"Forma de pago",fecha_entrega:"Fecha de entrega",precio_total:"Precio total (S/)",cuota_inicial:"Cuota inicial (S/)",cuotas:"N° de cuotas",monto_cuota:"Monto por cuota (S/)",monto_arras:"Monto de arras (S/)",plazo_escritura:"Plazo para escritura (días)",penalidad:"Penalidad por incumplimiento",quien_puede_desistir:"¿Quién puede desistir?",plazo_retracto:"Plazo de retracto (días)",descripcion_bien:"Descripción del bien",precio:"Precio (S/)",forma_entrega:"Forma de entrega",prestamista:"Nombre del prestamista",prestatario:"Nombre del prestatario",monto:"Monto del préstamo (S/)",interes_mensual:"Interés mensual (%)",plazo_meses:"Plazo (meses)",fecha_desembolso:"Fecha de desembolso",comodante:"Nombre del comodante",comodatario:"Nombre del comodatario",duracion:"Duración",condiciones_devolucion:"Condiciones de devolución",remuneracion:"Remuneración mensual (S/)",fecha_fin:"Fecha de fin",causa_objetiva:"Causa objetiva",lugar_trabajo:"Lugar de trabajo",horario:"Horario de trabajo",comitente:"Nombre del comitente",locador:"Nombre del locador",servicio:"Descripción del servicio",honorario_mensual:"Honorario mensual (S/)",razon_social:"Razón social",socios:"Socios (separados por coma)",aportes:"Aportes de cada socio (S/)",objeto_social:"Objeto social",domicilio:"Domicilio fiscal",gerente:"Gerente general",capital_social:"Capital social (S/)",titular:"Nombre del titular",capital_inicial:"Capital inicial (S/)",porcentajes:"Porcentajes de participación",distribucion_utilidades:"Distribución de utilidades",causales_exclusion:"Causales de exclusión de socio",derecho_preferencia:"Derecho de preferencia",empresa:"Nombre de la empresa",fecha_junta:"Fecha de la junta",socios_asistentes:"Socios asistentes",agenda:"Agenda de la junta",acuerdos:"Acuerdos adoptados",presidente_junta:"Presidente de la junta",cedente:"Nombre del cedente",cesionario:"Nombre del cesionario",numero_acciones:"N° de acciones",porcentaje:"Porcentaje que representa",precio_cesion:"Precio de cesión (S/)",fecha:"Fecha",garantia_meses2:"Meses de garantía",
};

const YAPE = { numero:"+51 999 000 111", titular:"Ochoa Maldonado & Abogados S. Civil" };
const fmt = n => `S/ ${Number(n).toFixed(2)}`;
const contarPalabras = t => t.trim() === "" ? 0 : t.trim().split(/\s+/).length;

// ══════════════════════════════════════════════════════════════
//  STORAGE SIMULADO DE PAGOS (in-memory)
// ══════════════════════════════════════════════════════════════
let PAGOS_STORE = [];
let PAGO_ID = 1;

function registrarPago({ tipo, concepto, monto, cliente }) {
  const p = {
    id: PAGO_ID++,
    fecha: new Date().toLocaleString("es-PE"),
    tipo, concepto, monto,
    cliente: cliente?.nombre || "–",
    dni: cliente?.dni || "–",
    email: cliente?.email || "–",
    igv: +(monto * 0.18).toFixed(2),
    baseImponible: +(monto / 1.18).toFixed(2),
  };
  PAGOS_STORE.push(p);
  return p;
}

// ══════════════════════════════════════════════════════════════
//  UI ATOMS
// ══════════════════════════════════════════════════════════════
function OMLogo({ size=32 }) {
  return (
    <svg width={size} height={size*0.7} viewBox="0 0 120 84" fill="none">
      <rect x="2" y="2" width="46" height="46" rx="8" stroke={B.gold} strokeWidth="5" fill="none"/>
      <text x="25" y="38" textAnchor="middle" fontFamily="serif" fontSize="32" fontWeight="bold" fill={B.gold}>O</text>
      <text x="82" y="50" textAnchor="middle" fontFamily="serif" fontSize="52" fontWeight="bold" fill={B.brown2} stroke={B.gold} strokeWidth="0.5">M</text>
    </svg>
  );
}

function Semaforo({ complejidad, showTime=false }) {
  const c = COMPLEJIDAD_CFG[complejidad];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background:c.bg, borderRadius:20, padding:"2px 9px", border:`1px solid ${c.color}30` }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:c.color,
        boxShadow:`0 0 6px ${c.glow}`,display:"inline-block" }} />
      <span style={{ color:c.color, fontSize:10, fontWeight:600 }}>{showTime ? c.time : c.label}</span>
    </span>
  );
}

function GoldBtn({ onClick, disabled, children, full=true, outline=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:full?"100%":"auto",
      background: outline?"transparent":disabled?"#e8d8c4":`linear-gradient(135deg,${B.gold},${B.goldL})`,
      color: outline?B.textMid:disabled?B.textDim:"#fffaf4",
      border: outline?`1px solid ${B.border}`:"none",
      borderRadius:6, padding:outline?"10px 16px":"13px 20px",
      fontSize:14, cursor:disabled?"not-allowed":"pointer",
      fontFamily:"'Playfair Display', serif", fontWeight:700,
      letterSpacing:0.8, transition:"all 0.2s",
      boxShadow: !disabled && !outline ? `0 4px 20px ${B.goldD}50` : "none"
    }}>{children}</button>
  );
}

function FieldInput({ label, value, onChange, placeholder, multiline=false }) {
  const base = {
    width:"100%", background:"#fff8f0", border:`1px solid ${B.border}`,
    borderRadius:6, padding:"9px 12px", color:B.text, fontSize:13,
    fontFamily:"'Cormorant Garamond', serif", outline:"none", boxSizing:"border-box"
  };
  return (
    <div style={{ marginBottom:10 }}>
      <label style={{ color:B.textMid, fontSize:10, display:"block", marginBottom:3,
        letterSpacing:1, textTransform:"uppercase" }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
            style={{ ...base, resize:"vertical", minHeight:80 }} />
        : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background:"none", border:"none", color:B.textDim,
      cursor:"pointer", fontSize:12, marginBottom:16, padding:0, display:"flex", alignItems:"center", gap:4 }}>
      ‹ Volver
    </button>
  );
}

function YapePanel({ monto, concepto }) {
  return (
    <div style={{ background:`#f0e8d8`, border:`1px solid ${B.border}`,
      borderRadius:10, padding:"18px 20px", textAlign:"center", marginBottom:16 }}>
      <div style={{ fontSize:30, marginBottom:6 }}>📱</div>
      <div style={{ color:B.textMid, fontSize:11, marginBottom:4 }}>Yapea o Plinea al número:</div>
      <div style={{ color:B.goldL, fontSize:22, fontFamily:"'Playfair Display', serif",
        fontWeight:700, letterSpacing:3, marginBottom:3 }}>{YAPE.numero}</div>
      <div style={{ color:B.textDim, fontSize:11, marginBottom:12 }}>
        A nombre de: <span style={{ color:B.textMid }}>{YAPE.titular}</span>
      </div>
      <div style={{ background:`${B.gold}15`, border:`1px solid ${B.gold}35`,
        borderRadius:8, padding:"10px 16px", display:"inline-flex", flexDirection:"column", gap:4, minWidth:240 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20 }}>
          <span style={{ color:B.textDim, fontSize:11 }}>Concepto:</span>
          <span style={{ color:B.textMid, fontSize:11 }}>{concepto}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20 }}>
          <span style={{ color:B.textDim, fontSize:11 }}>Monto exacto:</span>
          <span style={{ color:B.gold, fontSize:16, fontWeight:700 }}>{fmt(monto)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20 }}>
          <span style={{ color:B.textDim, fontSize:10 }}>Incluye IGV (18%):</span>
          <span style={{ color:B.textDim, fontSize:10 }}>{fmt(monto*0.18)}</span>
        </div>
      </div>
      <div style={{ color:B.textDim, fontSize:10, marginTop:10, fontStyle:"italic" }}>
        Capture la pantalla de confirmación antes de presionar "Confirmar Pago"
      </div>
    </div>
  );
}

function AreaTag({ area }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14,
      background:`${B.gold}08`, border:`1px solid ${B.gold}20`, borderRadius:8, padding:"8px 12px" }}>
      <span style={{ fontSize:16 }}>{area.icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ color:B.goldL, fontSize:12, fontFamily:"'Playfair Display', serif" }}>{area.area}</div>
        <Semaforo complejidad={area.complejidad} showTime />
      </div>
      <div style={{ color:B.gold, fontSize:14, fontWeight:700 }}>{fmt(area.precio)}</div>
    </div>
  );
}

function DocTag({ icon, nombre, precio, col }) {
  const c = col || B.gold;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14,
      background:`${c}08`, border:`1px solid ${c}20`, borderRadius:8, padding:"8px 12px" }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <div style={{ flex:1, color:B.text, fontSize:12, fontFamily:"'Playfair Display', serif" }}>{nombre}</div>
      <div style={{ color:c, fontSize:14, fontWeight:700 }}>{fmt(precio)}</div>
    </div>
  );
}

function Dots() {
  return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ color:B.textMid, fontSize:12, marginBottom:10 }}>Procesando con normativa peruana vigente...</div>
      <div style={{ display:"flex", justifyContent:"center", gap:5 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width:7,height:7,borderRadius:"50%",background:B.gold,
            animation:`pd 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes pd{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function ContactoBox() {
  return (
    <div style={{ background:`#f0e8d8`, border:`1px solid ${B.border}`, borderRadius:8,
      padding:"12px 16px", textAlign:"center", marginTop:14 }}>
      <div style={{ color:B.textMid, fontSize:11, marginBottom:4 }}>Asesoría judicial, firma o mayor consulta:</div>
      <div style={{ color:B.gold, fontSize:15, fontFamily:"'Playfair Display', serif" }}>📱 {YAPE.numero}</div>
      <div style={{ color:B.textDim, fontSize:10, marginTop:2 }}>consultas@ochoamaldonado.pe · Lun–Vie 9am–6pm</div>
    </div>
  );
}

function Disclaimer() {
  return (
    <p style={{ color:B.textDim, fontSize:9, textAlign:"center", marginTop:12, fontStyle:"italic", lineHeight:1.6 }}>
      Orientación legal referencial. Documento debe ser validado por abogado colegiado antes de su uso formal.
    </p>
  );
}

function ResultadoDoc({ titulo, cliente, loading, contenido }) {
  const [copiado, setCopiado] = useState(false);
  const copiar=()=>{ navigator.clipboard.writeText(contenido); setCopiado(true); setTimeout(()=>setCopiado(false),2000); };
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:14 }}>
        <div style={{ fontSize:28, marginBottom:4 }}>📄</div>
        <h2 style={{ fontFamily:"'Playfair Display', serif", color:B.goldL, fontSize:17, fontWeight:400 }}>Documento generado</h2>
        <div style={{ color:B.textDim, fontSize:11 }}>{cliente?.nombre}</div>
      </div>
      <div style={{ background:`#fff8f0`, border:`1px solid ${B.border}`, borderRadius:10, padding:18, marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ color:B.gold, fontSize:11, fontFamily:"'Playfair Display', serif" }}>⚖️ {titulo}</span>
          {!loading && (
            <button onClick={copiar} style={{ background:"none", border:`1px solid ${B.border}`, borderRadius:4, color:B.textDim, fontSize:10, padding:"2px 8px", cursor:"pointer" }}>
              {copiado?"✓ Copiado":"Copiar"}
            </button>
          )}
        </div>
        {loading ? <Dots /> : (
          <div style={{ color:B.text, fontSize:12, lineHeight:1.85, fontFamily:"'Cormorant Garamond', serif", whiteSpace:"pre-wrap", maxHeight:380, overflowY:"auto" }}>
            {contenido}
          </div>
        )}
      </div>
      {!loading && (
        <div style={{ background:`${B.gold}10`, border:`1px solid ${B.gold}25`, borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:11, color:B.textMid }}>
          💡 <strong style={{ color:B.gold }}>Siguiente paso:</strong> Llévelo al estudio para revisión, firma y certificación del abogado colegiado.
        </div>
      )}
      <ContactoBox /><Disclaimer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  FLUJO CLIENTE REUTILIZABLE
// ══════════════════════════════════════════════════════════════
function ClienteForm({ onNext, onBack }) {
  const [f, setF] = useState({ nombre:"", dni:"", email:"", tel:"", usaDni:true });
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const ok=f.nombre.trim()&&f.email.trim()&&f.tel.trim()&&(!f.usaDni||f.dni.length===8);
  return (
    <div>
      <BackBtn onClick={onBack} />
      <h2 style={{ fontFamily:"'Playfair Display', serif", color:B.goldL, fontSize:17, fontWeight:400, marginBottom:14 }}>
        Identificación del cliente
      </h2>
      <FieldInput label="Nombre completo *" value={f.nombre} onChange={v=>s("nombre",v)} placeholder="María Rosa García López" />
      <div style={{ marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
          <label style={{ color:B.textMid, fontSize:10, letterSpacing:1, textTransform:"uppercase" }}>DNI (recomendado)</label>
          <button onClick={()=>s("usaDni",!f.usaDni)} style={{ background:"none", border:"none", cursor:"pointer", color:f.usaDni?B.gold:B.textDim, fontSize:10 }}>
            {f.usaDni?"✓ Con DNI":"○ Sin DNI"}
          </button>
        </div>
        {f.usaDni
          ? <input maxLength={8} value={f.dni} onChange={e=>s("dni",e.target.value.replace(/\D/g,""))} placeholder="8 dígitos"
              style={{ width:"100%", background:"#fff8f0", border:`1px solid ${B.border}`, borderRadius:6, padding:"9px 12px", color:B.text, fontSize:13, fontFamily:"'Cormorant Garamond', serif", outline:"none", boxSizing:"border-box" }} />
          : <div style={{ background:`${B.yellow}08`, border:`1px solid ${B.yellow}30`, borderRadius:6, padding:"7px 12px", color:B.yellow, fontSize:11 }}>
              ⚠ Sin DNI el seguimiento del caso puede ser limitado.
            </div>
        }
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <FieldInput label="Teléfono / WhatsApp *" value={f.tel} onChange={v=>s("tel",v)} placeholder="+51 999..." />
        <FieldInput label="Correo electrónico *" value={f.email} onChange={v=>s("email",v)} placeholder="correo@..." />
      </div>
      <GoldBtn onClick={()=>onNext(f)} disabled={!ok}>Continuar →</GoldBtn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PANEL DE PAGOS (Admin)
// ══════════════════════════════════════════════════════════════
function PanelPagos({ onClose }) {
  const [pin, setPin] = useState("");
  const [auth, setAuth] = useState(false);
  const PIN_CORRECTO = "2024";

  const total = PAGOS_STORE.reduce((a,p)=>a+p.monto,0);
  const totalIGV = PAGOS_STORE.reduce((a,p)=>a+p.igv,0);
  const totalBase = PAGOS_STORE.reduce((a,p)=>a+p.baseImponible,0);

  if (!auth) return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:28, marginBottom:8 }}>🔐</div>
      <h2 style={{ fontFamily:"'Playfair Display', serif", color:B.goldL, fontSize:18, fontWeight:400, marginBottom:4 }}>
        Panel Administrativo
      </h2>
      <p style={{ color:B.textMid, fontSize:12, marginBottom:20 }}>Ingrese el PIN del estudio</p>
      <input type="password" value={pin} onChange={e=>setPin(e.target.value)} maxLength={4}
        placeholder="••••" style={{ width:120, textAlign:"center", background:`#fff8f0`,
          border:`1px solid ${B.border}`, borderRadius:8, padding:"10px", color:B.goldL,
          fontSize:22, letterSpacing:6, fontFamily:"'Playfair Display', serif", outline:"none", display:"block", margin:"0 auto 16px" }} />
      <GoldBtn onClick={()=>{ if(pin===PIN_CORRECTO) setAuth(true); else alert("PIN incorrecto"); }} disabled={pin.length!==4}>
        Ingresar
      </GoldBtn>
      <div style={{ marginTop:12 }}>
        <button onClick={onClose} style={{ background:"none", border:"none", color:B.textDim, cursor:"pointer", fontSize:12 }}>Cancelar</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontFamily:"'Playfair Display', serif", color:B.goldL, fontSize:17, fontWeight:400, margin:0 }}>
          📊 Panel de Pagos
        </h2>
        <button onClick={onClose} style={{ background:"none", border:"none", color:B.textDim, cursor:"pointer", fontSize:20 }}>✕</button>
      </div>

      {/* Resumen SUNAT */}
      <div style={{ background:`${B.gold}08`, border:`1px solid ${B.gold}25`, borderRadius:10, padding:14, marginBottom:16 }}>
        <div style={{ color:B.textMid, fontSize:10, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>
          Resumen tributario (para SUNAT)
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, textAlign:"center" }}>
          {[
            ["Ingresos totales", fmt(total), B.gold],
            ["Base imponible", fmt(totalBase), B.green],
            ["IGV 18%", fmt(totalIGV), B.yellow],
          ].map(([l,v,c])=>(
            <div key={l} style={{ background:`#f0e8d8`, borderRadius:8, padding:"8px 6px" }}>
              <div style={{ color:B.textDim, fontSize:9, marginBottom:3 }}>{l}</div>
              <div style={{ color:c, fontSize:13, fontWeight:700, fontFamily:"'Playfair Display', serif" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:10, padding:"8px 10px", background:`${B.yellow}08`, border:`1px solid ${B.yellow}20`, borderRadius:6, fontSize:10, color:B.textMid }}>
          ⚠ <strong style={{ color:B.yellow }}>Nota SUNAT:</strong> Emita comprobante (boleta/factura) por cada operación. RUS: S/20/mes si ingresos ≤ S/5,000. Consulte con su contador.
        </div>
      </div>

      {/* Tabla de pagos */}
      {PAGOS_STORE.length === 0 ? (
        <div style={{ textAlign:"center", padding:"30px 0", color:B.textDim, fontSize:13 }}>
          Aún no hay pagos registrados.
        </div>
      ) : (
        <div style={{ maxHeight:320, overflowY:"auto" }}>
          {[...PAGOS_STORE].reverse().map(p=>(
            <div key={p.id} style={{ background:`#f8f0e4`, border:`1px solid ${B.border}`,
              borderRadius:8, padding:"10px 12px", marginBottom:7 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div>
                  <span style={{ background:`${B.gold}15`, color:B.gold, fontSize:9, borderRadius:3, padding:"1px 6px", fontWeight:700 }}>
                    #{p.id} · {p.tipo}
                  </span>
                  <div style={{ color:B.text, fontSize:12, marginTop:3, fontFamily:"'Playfair Display', serif" }}>{p.concepto}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:B.gold, fontSize:14, fontWeight:700 }}>{fmt(p.monto)}</div>
                  <div style={{ color:B.textDim, fontSize:9 }}>IGV: {fmt(p.igv)}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[["👤",p.cliente],["🪪",p.dni],["📧",p.email],["🕐",p.fecha]].map(([ic,v])=>(
                  <span key={ic} style={{ color:B.textDim, fontSize:10 }}>{ic} {v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:14, padding:"8px 12px", background:`#f0e8d8`, borderRadius:6, fontSize:10, color:B.textDim, textAlign:"center" }}>
        {PAGOS_STORE.length} pago{PAGOS_STORE.length!==1?"s":""} registrado{PAGOS_STORE.length!==1?"s":""}
        · PIN de acceso: para cambiar, contacte al desarrollador
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  FLUJO CONSULTA
// ══════════════════════════════════════════════════════════════
function FlujoCon({ onBack }) {
  const [step,setStep]=useState("area");
  const [area,setArea]=useState(null);
  const [cliente,setCliente]=useState(null);
  const [consulta,setConsulta]=useState("");
  const [sugerida,setSugerida]=useState(null);
  const [procesando,setProcesando]=useState(false);
  const [resp,setResp]=useState("");
  const [loadingR,setLoadingR]=useState(false);
  const [filtro,setFiltro]=useState("todas");
  const [hovered,setHovered]=useState(null);

  const palabras = contarPalabras(consulta);
  const sobrePalabras = palabras > MAX_PALABRAS;

  if(step==="area") {
    const lista=filtro==="todas"?TARIFARIO_CONSULTAS:TARIFARIO_CONSULTAS.filter(t=>t.complejidad===filtro);
    return (
      <div>
        <BackBtn onClick={onBack} />
        <h2 style={{ fontFamily:"'Playfair Display', serif", color:B.goldL, fontSize:19, fontWeight:400, marginBottom:4 }}>¿Sobre qué materia?</h2>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
          {["todas","simple","moderada","compleja"].map(f=>{
            const c=f==="todas"?null:COMPLEJIDAD_CFG[f];
            return (
              <button key={f} onClick={()=>setFiltro(f)} style={{ background:filtro===f?(c?c.bg:`${B.gold}15`):"transparent",
                border:`1px solid ${filtro===f?(c?c.color:B.gold):B.border2}`,
                borderRadius:16,padding:"3px 10px",cursor:"pointer",fontSize:10,
                color:filtro===f?(c?c.color:B.gold):B.textDim,
                display:"flex",alignItems:"center",gap:4,transition:"all 0.2s" }}>
                {c&&<span style={{ width:5,height:5,borderRadius:"50%",background:c.color,display:"inline-block" }} />}
                {f==="todas"?"Todas":COMPLEJIDAD_CFG[f].label}
              </button>
            );
          })}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
          {lista.map(t=>(
            <button key={t.id} onClick={()=>{setArea(t);setStep("cliente");}}
              onMouseEnter={()=>setHovered(t.id)} onMouseLeave={()=>setHovered(null)}
              style={{ background:hovered===t.id?`#e8d8c4`:`#f8f0e4`,
                border:`1px solid ${hovered===t.id?B.gold:B.border}`, borderRadius:8,
                padding:"11px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s" }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:17 }}>{t.icon}</span>
                <span style={{ background:`${B.gold}20`,color:B.gold,fontSize:10,fontWeight:700,borderRadius:4,padding:"1px 6px",border:`1px solid ${B.gold}30` }}>{fmt(t.precio)}</span>
              </div>
              <div style={{ color:B.text,fontSize:12,fontWeight:600,marginBottom:4 }}>{t.area}</div>
              <Semaforo complejidad={t.complejidad} showTime />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if(step==="cliente") return <ClienteForm onBack={()=>setStep("area")} onNext={d=>{setCliente(d);setStep("consulta");}} />;

  if(step==="consulta") {
    return (
      <div>
        <BackBtn onClick={()=>setStep("cliente")} />
        <AreaTag area={area} />
        <h2 style={{ fontFamily:"'Playfair Display', serif", color:B.goldL, fontSize:17, fontWeight:400, marginBottom:4 }}>Redacte su consulta</h2>
        <p style={{ color:B.textMid, fontSize:12, marginBottom:10 }}>
          Hola <span style={{ color:B.gold }}>{cliente.nombre.split(" ")[0]}</span>. Seleccione una pregunta frecuente o escriba la suya.
        </p>
        {/* Preguntas frecuentes */}
        <div style={{ display:"flex",flexDirection:"column",gap:4,marginBottom:12 }}>
          {area.faqs.map((q,i)=>(
            <button key={i} onClick={()=>{setConsulta(q);setSugerida(q);}}
              style={{ background:sugerida===q?`#e8d8c4`:`#f8f0e4`,
                border:`1px solid ${sugerida===q?B.gold:B.border}`,
                borderRadius:6,padding:"7px 10px",cursor:"pointer",
                textAlign:"left",color:sugerida===q?B.gold:B.textMid,
                fontSize:12,fontFamily:"'Cormorant Garamond', serif",transition:"all 0.15s" }}>
              › {q}
            </button>
          ))}
        </div>
        {/* Textarea con contador */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
            <label style={{ color:B.textMid,fontSize:10,letterSpacing:1,textTransform:"uppercase" }}>O escriba su consulta *</label>
            <span style={{ fontSize:10, color: sobrePalabras?B.red:palabras>MAX_PALABRAS*0.8?B.yellow:B.textDim }}>
              {palabras}/{MAX_PALABRAS} palabras
            </span>
          </div>
          <textarea value={consulta} onChange={e=>{setConsulta(e.target.value);setSugerida(null);}}
            placeholder="Describa su situación con fechas, partes involucradas y qué desea lograr..."
            style={{ width:"100%",background:`#fff8f0`,border:`1px solid ${sobrePalabras?B.red:B.border}`,
              borderRadius:6,padding:"10px 12px",color:B.text,fontSize:13,
              fontFamily:"'Cormorant Garamond', serif",outline:"none",resize:"vertical",
              minHeight:100,boxSizing:"border-box" }} />
          {sobrePalabras && (
            <div style={{ color:B.red, fontSize:11, marginTop:3, background:`${B.red}10`,
              border:`1px solid ${B.red}30`, borderRadius:6, padding:"6px 10px" }}>
              ⚠ Su consulta excede las {MAX_PALABRAS} palabras ({palabras} palabras).
              Por favor resuma un poco para continuar.
            </div>
          )}
          {!sobrePalabras && palabras > MAX_PALABRAS*0.8 && palabras > 0 && (
            <div style={{ color:B.yellow, fontSize:10, marginTop:2 }}>
              ⚠ Le quedan solo {MAX_PALABRAS-palabras} palabras
            </div>
          )}
          {!sobrePalabras && palabras > 0 && palabras <= MAX_PALABRAS*0.8 && (
            <div style={{ color:B.textDim, fontSize:10, marginTop:2 }}>
              {MAX_PALABRAS-palabras} palabras restantes
            </div>
          )}
        </div>
        <GoldBtn onClick={()=>setStep("pago")} disabled={!consulta.trim()||sobrePalabras}>Continuar →</GoldBtn>
      </div>
    );
  }

  if(step==="pago") {
    const handlePagar=()=>{
      setProcesando(true);
      registrarPago({ tipo:"Consulta", concepto:`Consulta ${area.area}`, monto:area.precio, cliente });
      setTimeout(()=>{setProcesando(false);setStep("respuesta");generarRespuesta();},2000);
    };
    return (
      <div>
        <BackBtn onClick={()=>setStep("consulta")} />
        <AreaTag area={area} />
        <YapePanel monto={area.precio} concepto={`Consulta ${area.area}`} />
        <GoldBtn onClick={handlePagar} disabled={procesando}>
          {procesando?"⏳ Verificando...": `Confirmar Pago — ${fmt(area.precio)}`}
        </GoldBtn>
        <p style={{ color:B.textDim,fontSize:10,textAlign:"center",marginTop:8 }}>
          Pago exclusivo por Yape o Plin · {COMPLEJIDAD_CFG[area.complejidad].time}
        </p>
      </div>
    );
  }

  async function generarRespuesta() {
    setLoadingR(true);
    try {
      const prompt=`Eres el abogado principal del Estudio Jurídico OCHOA MALDONADO & ABOGADOS S. CIVIL (Lima, Perú). Responde esta consulta de ${cliente.nombre} sobre ${area.area}. Sé claro, empático y estructurado: (1) Análisis legal con artículos aplicables, (2) Pasos a seguir, (3) Jurisprudencia del TC o Corte Suprema si aplica, (4) Recomendación final. Si requiere proceso judicial, invita a contratar patrocinio.\n\nConsulta: ${consulta}`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();
      setResp(d.content?.map(b=>b.text||"").join("")||"Sin respuesta.");
    } catch { setResp("Error técnico. Será contactado por el estudio."); }
    finally { setLoadingR(false); }
  }

  if(step==="respuesta") return (
    <div>
      <div style={{ textAlign:"center",marginBottom:16 }}>
        <div style={{ fontSize:28,marginBottom:4 }}>✅</div>
        <h2 style={{ fontFamily:"'Playfair Display', serif",color:B.goldL,fontSize:17,fontWeight:400,margin:0 }}>Consulta procesada</h2>
        <div style={{ color:B.textDim,fontSize:11,marginTop:2 }}>{cliente.nombre} · {cliente.email}</div>
        <div style={{ marginTop:6 }}><Semaforo complejidad={area.complejidad} showTime /></div>
      </div>
      <div style={{ background:`#fff8f0`,border:`1px solid ${B.border}`,borderRadius:10,padding:18,marginBottom:14 }}>
        <div style={{ color:B.gold,fontSize:11,fontStyle:"italic",marginBottom:10,fontFamily:"'Playfair Display', serif" }}>
          ⚖️ Respuesta del Estudio Ochoa Maldonado & Abogados S. Civil
        </div>
        {loadingR?<Dots />:<div style={{ color:B.text,fontSize:13,lineHeight:1.8,fontFamily:"'Cormorant Garamond', serif",whiteSpace:"pre-wrap" }}>{resp}</div>}
      </div>
      <ContactoBox /><Disclaimer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  FLUJO GENÉRICO ESCRITOS / CONTRATOS
// ══════════════════════════════════════════════════════════════
function FlujoDoc({ items, titulo, descripcion, onBack, tipo, colFn }) {
  const [step,setStep]=useState("lista");
  const [item,setItem]=useState(null);
  const [cliente,setCliente]=useState(null);
  const [datos,setDatos]=useState({});
  const [procesando,setProcesando]=useState(false);
  const [resultado,setResultado]=useState("");
  const [loading,setLoading]=useState(false);
  const [hovered,setHovered]=useState(null);
  const [catFiltro,setCatFiltro]=useState("todas");

  const lista2 = items[0]?.cat
    ? (catFiltro==="todas"?items:items.filter(i=>i.cat===catFiltro))
    : items;

  if(step==="lista") return (
    <div>
      <BackBtn onClick={onBack} />
      <h2 style={{ fontFamily:"'Playfair Display', serif",color:B.goldL,fontSize:19,fontWeight:400,marginBottom:4 }}>{titulo}</h2>
      <p style={{ color:B.textMid,fontSize:12,marginBottom:14 }}>{descripcion}</p>
      {items[0]?.cat && (
        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
          {["todas","civil","laboral","societario"].map(f=>{
            const col=f==="todas"?B.gold:CAT_COLORS[f];
            return (
              <button key={f} onClick={()=>setCatFiltro(f)} style={{ background:catFiltro===f?`${col}15`:"transparent",
                border:`1px solid ${catFiltro===f?col:B.border2}`,borderRadius:16,padding:"3px 10px",
                cursor:"pointer",color:catFiltro===f?col:B.textDim,fontSize:10,transition:"all 0.2s" }}>
                {f==="todas"?"Todos":CAT_LABELS[f]}
              </button>
            );
          })}
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:7 }}>
        {lista2.map(it=>{
          const col=colFn?colFn(it):B.gold;
          return (
            <button key={it.id} onClick={()=>{setItem(it);setDatos({});setStep("cliente");}}
              onMouseEnter={()=>setHovered(it.id)} onMouseLeave={()=>setHovered(null)}
              style={{ background:hovered===it.id?`#e8d8c4`:`#f8f0e4`,
                border:`1px solid ${hovered===it.id?col:B.border}`,borderRadius:8,
                padding:"11px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.2s" }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                <span style={{ fontSize:17 }}>{it.icon}</span>
                <span style={{ background:`${col}20`,color:col,fontSize:10,fontWeight:700,borderRadius:4,padding:"1px 6px",border:`1px solid ${col}35` }}>{fmt(it.precio)}</span>
              </div>
              <div style={{ color:B.text,fontSize:11,fontWeight:600,lineHeight:1.3,marginBottom:it.cat?4:0 }}>{it.nombre}</div>
              {it.cat && <div style={{ color:CAT_COLORS[it.cat],fontSize:9,letterSpacing:0.5,textTransform:"uppercase" }}>{CAT_LABELS[it.cat]}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );

  if(step==="cliente") return <ClienteForm onBack={()=>setStep("lista")} onNext={d=>{setCliente(d);setStep("datos");}} />;

  if(step==="datos") {
    const col=colFn?colFn(item):B.gold;
    const ok=item.campos.every(c=>datos[c]?.trim());
    return (
      <div>
        <BackBtn onClick={()=>setStep("cliente")} />
        <DocTag icon={item.icon} nombre={item.nombre} precio={item.precio} col={col} />
        <h2 style={{ fontFamily:"'Playfair Display', serif",color:B.goldL,fontSize:16,fontWeight:400,marginBottom:12 }}>Datos del documento</h2>
        {item.campos.map(c=>(
          <FieldInput key={c} label={LABELS_MAP[c]||c} value={datos[c]||""} onChange={v=>setDatos(p=>({...p,[c]:v}))} placeholder="..." />
        ))}
        <GoldBtn onClick={()=>setStep("pago")} disabled={!ok}>Continuar →</GoldBtn>
      </div>
    );
  }

  if(step==="pago") {
    const handlePagar=()=>{
      setProcesando(true);
      registrarPago({ tipo, concepto:item.nombre, monto:item.precio, cliente });
      setTimeout(()=>{setProcesando(false);setStep("resultado");generarDoc();},2000);
    };
    const col=colFn?colFn(item):B.gold;
    return (
      <div>
        <BackBtn onClick={()=>setStep("datos")} />
        <DocTag icon={item.icon} nombre={item.nombre} precio={item.precio} col={col} />
        <YapePanel monto={item.precio} concepto={item.nombre} />
        <GoldBtn onClick={handlePagar} disabled={procesando}>
          {procesando?"⏳ Verificando...": `Confirmar Pago — ${fmt(item.precio)}`}
        </GoldBtn>
      </div>
    );
  }

  async function generarDoc() {
    setLoading(true);
    try {
      const datosStr=Object.entries(datos).map(([k,v])=>`${k}: ${v}`).join("\n");
      const esContrato=tipo==="Contrato";
      const prompt=`Eres el abogado redactor del Estudio Jurídico OCHOA MALDONADO & ABOGADOS S. CIVIL (Lima, Perú). Redacta el siguiente ${esContrato?"contrato":"escrito judicial"} en formato legal peruano completo y formal:\n\nTipo: ${item.nombre}\nCliente: ${cliente.nombre}${cliente.dni?` (DNI: ${cliente.dni})`:""}\n\nDatos:\n${datosStr}\n\n${esContrato?"Incluye: lugar y fecha, identificación de partes, cláusulas numeradas (objeto, precio, plazos, garantías, penalidades, resolución, jurisdicción Lima), firma del abogado.":"Incluye: encabezado formal peruano, sumilla, normas legales aplicables del Código Civil/Procesal Civil vigentes, petitorio claro, datos del abogado del estudio."} Formato profesional completo, listo para usar.`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();
      setResultado(d.content?.map(b=>b.text||"").join("")||"Error al generar.");
    } catch { setResultado("Error técnico. Contáctenos."); }
    finally { setLoading(false); }
  }

  if(step==="resultado") return <ResultadoDoc titulo={item.nombre} cliente={cliente} loading={loading} contenido={resultado} />;
}

// ══════════════════════════════════════════════════════════════
//  APP PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [seccion,setSeccion]=useState("home");
  const [showAdmin,setShowAdmin]=useState(false);

  const SECCIONES=[
    { id:"consultas",label:"Consultas Legales",icon:"💬",desc:"Orientación jurídica con respuesta rápida del estudio",col:B.gold },
    { id:"escritos",label:"Escritos Judiciales",icon:"📋",desc:"Demandas, recursos y escritos ante el Poder Judicial",col:B.blue },
    { id:"contratos",label:"Contratos",icon:"📄",desc:"Contratos civiles, laborales y societarios personalizados",col:B.purple },
  ];

  if(showAdmin) return <Layout onAdmin={()=>setShowAdmin(true)}><PanelPagos onClose={()=>setShowAdmin(false)} /></Layout>;
  if(seccion==="consultas") return <Layout onAdmin={()=>setShowAdmin(true)}><FlujoCon onBack={()=>setSeccion("home")} /></Layout>;
  if(seccion==="escritos") return <Layout onAdmin={()=>setShowAdmin(true)}>
    <FlujoDoc items={ESCRITOS} titulo="Escritos Judiciales" descripcion="Redacción profesional de escritos con normativa peruana vigente. Listos para presentar ante el Poder Judicial." onBack={()=>setSeccion("home")} tipo="Escrito" colFn={()=>B.blue} />
  </Layout>;
  if(seccion==="contratos") return <Layout onAdmin={()=>setShowAdmin(true)}>
    <FlujoDoc items={CONTRATOS} titulo="Contratos" descripcion="Contratos personalizados basados en el Código Civil peruano. Con todas las cláusulas necesarias." onBack={()=>setSeccion("home")} tipo="Contrato" colFn={it=>CAT_COLORS[it.cat]||B.gold} />
  </Layout>;

  // ── HOME ──
  return (
    <Layout onAdmin={()=>setShowAdmin(true)}>
      {/* Tagline */}
      <div style={{ textAlign:"center",marginBottom:24 }}>
        <p style={{ color:B.textMid,fontSize:13,fontFamily:"'Cormorant Garamond', serif",
          fontStyle:"italic",lineHeight:1.7,maxWidth:320,margin:"0 auto" }}>
          Servicios legales profesionales en línea.<br />
          <span style={{ color:B.gold }}>Pago por Yape · Respuesta según complejidad.</span>
        </p>
        {/* Chips de tiempo */}
        <div style={{ display:"flex",gap:6,justifyContent:"center",marginTop:10,flexWrap:"wrap" }}>
          <Semaforo complejidad="simple" showTime />
          <Semaforo complejidad="moderada" showTime />
          <Semaforo complejidad="compleja" showTime />
        </div>
      </div>

      {/* Cards de sección */}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {SECCIONES.map(s=>(
          <button key={s.id} onClick={()=>setSeccion(s.id)} style={{
            background:`#f8f0e4`,border:`1px solid ${B.border}`,
            borderRadius:12,padding:"16px 18px",cursor:"pointer",textAlign:"left",
            transition:"all 0.25s",display:"flex",alignItems:"center",gap:14
          }}
          onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${s.col}`;e.currentTarget.style.background=`#f0e4d0`;}}
          onMouseLeave={e=>{e.currentTarget.style.border=`1px solid ${B.border}`;e.currentTarget.style.background=`#f8f0e4`;}}>
            <div style={{ width:44,height:44,borderRadius:10,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:20,background:`${s.col}15`,flexShrink:0,border:`1px solid ${s.col}25` }}>
              {s.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:B.goldL,fontSize:15,fontFamily:"'Playfair Display', serif",fontWeight:600,marginBottom:2 }}>{s.label}</div>
              <div style={{ color:B.textMid,fontSize:11,fontFamily:"'Cormorant Garamond', serif" }}>{s.desc}</div>
            </div>
            <div style={{ color:B.textDim,fontSize:18 }}>›</div>
          </button>
        ))}
      </div>

      {/* Tarifario */}
      <div style={{ marginTop:20,padding:"14px 16px",background:`#f0e8d8`,border:`1px solid ${B.border}`,borderRadius:10 }}>
        <div style={{ color:B.textMid,fontSize:10,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10,textAlign:"center" }}>
          Tarifario referencial · Pago por 📱 Yape / Plin
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,textAlign:"center" }}>
          {[["💬","Consultas","S/12 – S/50",B.gold],["📋","Escritos","S/50 – S/120",B.blue],["📄","Contratos","S/50 – S/200",B.purple]].map(([ic,t,p,c])=>(
            <div key={t} style={{ padding:"8px 6px",background:`#fffaf4`,borderRadius:8,border:`1px solid ${B.border}` }}>
              <div style={{ fontSize:14,marginBottom:2 }}>{ic}</div>
              <div style={{ color:B.textDim,fontSize:9,marginBottom:3 }}>{t}</div>
              <div style={{ color:c,fontSize:11,fontWeight:700,fontFamily:"'Playfair Display', serif" }}>{p}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// ══════════════════════════════════════════════════════════════
//  LAYOUT
// ══════════════════════════════════════════════════════════════
function Layout({ children, onAdmin }) {
  return (
    <div style={{ minHeight:"100vh",background:B.bg,
      backgroundImage:`radial-gradient(ellipse at 15% 10%, #e8d0b040 0%, transparent 50%), radial-gradient(ellipse at 85% 90%, #d4b89630 0%, transparent 50%)`,
      padding:"18px 14px 48px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *{box-sizing:border-box}
        button:focus,input:focus,textarea:focus{outline:none}
        input:focus,textarea:focus{border-color:${B.gold} !important}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${B.border}}
      `}</style>

      {/* HEADER */}
      <div style={{ maxWidth:500,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          {/* Logo OM simplificado en CSS */}
          <div style={{ width:42,height:42,background:B.brown2,borderRadius:8,
            display:"flex",alignItems:"center",justifyContent:"center",
            border:`1px solid ${B.gold}40`,boxShadow:`0 0 20px ${B.goldD}30`,flexShrink:0 }}>
            <span style={{ fontFamily:"'Playfair Display', serif",fontWeight:700,
              color:B.gold,fontSize:17,letterSpacing:-1 }}>OM</span>
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display', serif",color:B.goldL,
              fontSize:13,fontWeight:700,lineHeight:1,letterSpacing:0.3 }}>OCHOA MALDONADO</div>
            <div style={{ color:B.textDim,fontSize:8,letterSpacing:2,textTransform:"uppercase",marginTop:2 }}>
              & Abogados S. Civil · Est. Jurídico
            </div>
          </div>
        </div>
        {/* Botón admin discreto */}
        <button onClick={onAdmin} style={{ background:"none",border:`1px solid ${B.border}`,
          borderRadius:6,padding:"4px 8px",cursor:"pointer",color:B.textDim,fontSize:10,
          display:"flex",alignItems:"center",gap:4 }}>
          📊 Admin
        </button>
      </div>

      {/* Línea dorada decorativa */}
      <div style={{ maxWidth:500,margin:"0 auto 18px" }}>
        <div style={{ height:1,background:`linear-gradient(90deg,transparent,${B.gold}60,transparent)` }} />
      </div>

      {/* CARD */}
      <div style={{ maxWidth:500,margin:"0 auto",
        background:`linear-gradient(160deg, ${B.card} 0%, #fdf5e8 100%)`,
        border:`1px solid ${B.border}`,
        borderRadius:14,padding:"22px 18px",
        boxShadow:`0 8px 40px rgba(90,50,20,0.12), inset 0 1px 0 #ffffff80` }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center",marginTop:16,maxWidth:500,margin:"16px auto 0" }}>
        <div style={{ height:1,background:`linear-gradient(90deg,transparent,${B.border},transparent)`,marginBottom:10 }} />
        <div style={{ color:B.textDim,fontSize:9,letterSpacing:0.8 }}>
          © 2026 OCHOA MALDONADO & ABOGADOS S. CIVIL · Lima, Perú · Todos los derechos reservados
        </div>
      </div>
    </div>
  );
}
