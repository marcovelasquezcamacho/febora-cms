import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"
    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre        = Column(String(120), nullable=False)
    email         = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol           = Column(String(30), default="editor")
    activo        = Column(Boolean, default=True)
    ultimo_acceso = Column(DateTime, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)

class SiteConfig(Base):
    __tablename__ = "site_config"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clave       = Column(String(100), unique=True, nullable=False)
    valor       = Column(Text)
    tipo        = Column(String(30), default="text")
    descripcion = Column(String(255))
    updated_by  = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class HeroSection(Base):
    __tablename__ = "hero_section"
    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    badge_texto          = Column(String(200))
    badge_color          = Column(String(30), default="#F2A900")
    titulo_linea1        = Column(String(100))
    titulo_linea2        = Column(String(100))
    titulo_linea3        = Column(String(100))
    color_linea1         = Column(String(30), default="#C8102E")
    color_linea2         = Column(String(30), default="#FFFFFF")
    color_linea3         = Column(String(30), default="#007A33")
    subtitulo            = Column(Text)
    btn_primario_label   = Column(String(80))
    btn_primario_url     = Column(String(200))
    btn_secundario_label = Column(String(80))
    btn_secundario_url   = Column(String(200))
    imagen_fondo_url     = Column(String(500))
    activo               = Column(Boolean, default=True)
    updated_by           = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at           = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Estadistica(Base):
    __tablename__ = "estadisticas"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    valor      = Column(String(30), nullable=False)
    etiqueta   = Column(String(120), nullable=False)
    icono      = Column(String(50))
    orden      = Column(Integer, default=0)
    visible    = Column(Boolean, default=True)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Jugador(Base):
    __tablename__ = "jugadores"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre            = Column(String(100), nullable=False)
    apellido          = Column(String(100), nullable=False)
    iniciales         = Column(String(4))
    ranking_etiqueta  = Column(String(80))
    ranking_color     = Column(String(30), default="#F2A900")
    tag_texto         = Column(String(80))
    tag_color         = Column(String(30), default="red")
    descripcion_corta = Column(Text)
    biografia         = Column(Text)
    foto_url          = Column(String(500))
    nacionalidad      = Column(String(80), default="Bolivia")
    orden             = Column(Integer, default=0)
    activo            = Column(Boolean, default=True)
    created_by        = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    created_at        = Column(DateTime, default=datetime.utcnow)
    updated_at        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    logros            = relationship("JugadorLogro", back_populates="jugador", cascade="all, delete-orphan")

class JugadorLogro(Base):
    __tablename__ = "jugador_logros"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    jugador_id  = Column(UUID(as_uuid=True), ForeignKey("jugadores.id"), nullable=False)
    titulo      = Column(String(200))
    anio        = Column(String(10))
    descripcion = Column(Text)
    orden       = Column(Integer, default=0)
    jugador     = relationship("Jugador", back_populates="logros")

class Noticia(Base):
    __tablename__ = "noticias"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo            = Column(String(300), nullable=False)
    slug              = Column(String(350), unique=True, nullable=False)
    categoria         = Column(String(80))
    categoria_color   = Column(String(20), default="red")
    resumen           = Column(Text)
    contenido         = Column(Text)
    imagen_url        = Column(String(500))
    destacada         = Column(Boolean, default=False)
    publicada         = Column(Boolean, default=False)
    autor_id          = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    fecha_publicacion = Column(DateTime, nullable=True)
    created_at        = Column(DateTime, default=datetime.utcnow)
    updated_at        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Logro(Base):
    __tablename__ = "logros"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    icono        = Column(String(10))
    numero       = Column(String(30), nullable=False)
    descripcion  = Column(Text)
    color_acento = Column(String(20), default="rojo")
    numero_orden = Column(Integer, default=0)
    visible      = Column(Boolean, default=True)
    updated_by   = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SeccionNosotros(Base):
    __tablename__ = "seccion_nosotros"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tag_texto         = Column(String(80))
    titulo_linea1     = Column(String(100))
    titulo_linea2     = Column(String(100))
    titulo_linea3     = Column(String(100))
    titulo_color      = Column(String(30), default="#007A33")
    parrafo1          = Column(Text)
    parrafo2          = Column(Text)
    imagen_escudo_url = Column(String(500))
    updated_by        = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    pills             = relationship("NosotrosPill", back_populates="seccion", cascade="all, delete-orphan")

class NosotrosPill(Base):
    __tablename__ = "nosotros_pills"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seccion_id = Column(UUID(as_uuid=True), ForeignKey("seccion_nosotros.id"), nullable=False)
    texto      = Column(String(100))
    orden      = Column(Integer, default=0)
    visible    = Column(Boolean, default=True)
    seccion    = relationship("SeccionNosotros", back_populates="pills")

class CtaSection(Base):
    __tablename__ = "cta_section"
    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo_linea1        = Column(String(100))
    titulo_linea2        = Column(String(100))
    subtitulo            = Column(Text)
    btn_primario_label   = Column(String(80))
    btn_primario_url     = Column(String(200))
    btn_secundario_label = Column(String(80))
    btn_secundario_url   = Column(String(200))
    activo               = Column(Boolean, default=True)
    updated_by           = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at           = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FooterConfig(Base):
    __tablename__ = "footer_config"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    texto_copyright = Column(String(300))
    logo_texto      = Column(String(50))
    updated_by      = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    links           = relationship("FooterLink", back_populates="footer", cascade="all, delete-orphan")

class FooterLink(Base):
    __tablename__ = "footer_links"
    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    footer_id = Column(UUID(as_uuid=True), ForeignKey("footer_config.id"), nullable=False)
    etiqueta  = Column(String(80))
    url       = Column(String(300))
    orden     = Column(Integer, default=0)
    visible   = Column(Boolean, default=True)
    footer    = relationship("FooterConfig", back_populates="links")

class MediaFile(Base):
    __tablename__ = "media_files"
    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre_original   = Column(String(300))
    nombre_almacenado = Column(String(300))
    url               = Column(String(600))
    tipo_mime         = Column(String(80))
    tamano_kb         = Column(Integer)
    carpeta           = Column(String(100), default="general")
    subido_por        = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    created_at        = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_log"
    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id       = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    accion           = Column(String(20))
    tabla_afectada   = Column(String(80))
    registro_id      = Column(UUID(as_uuid=True), nullable=True)
    payload_anterior = Column(Text)
    payload_nuevo    = Column(Text)
    ip_address       = Column(String(45))
    created_at       = Column(DateTime, default=datetime.utcnow)

class Popup(Base):
    __tablename__ = "popups"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo      = Column(String(200), nullable=False)
    contenido   = Column(Text)
    imagen_url  = Column(String(500))
    btn_label   = Column(String(80))
    btn_url     = Column(String(300))
    tipo        = Column(String(20), default="info")  # info | alerta | invitacion | comunicado
    activo      = Column(Boolean, default=True)
    mostrar_una_vez = Column(Boolean, default=False)
    fecha_inicio = Column(DateTime, nullable=True)
    fecha_fin    = Column(DateTime, nullable=True)
    updated_by  = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GaleriaFoto(Base):
    __tablename__ = "galeria_fotos"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo      = Column(String(200))
    descripcion = Column(Text)
    imagen_url  = Column(String(500), nullable=False)
    categoria   = Column(String(50), default="general")
    orden       = Column(Integer, default=0)
    destacada   = Column(Boolean, default=False)
    visible     = Column(Boolean, default=True)
    updated_by  = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Sponsor(Base):
    __tablename__ = "sponsors"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre      = Column(String(200), nullable=False)
    logo_url    = Column(String(500))
    sitio_web   = Column(String(300))
    categoria   = Column(String(50), default="general")  # oro | plata | bronce | general
    orden       = Column(Integer, default=0)
    visible     = Column(Boolean, default=True)
    updated_by  = Column(UUID(as_uuid=True), ForeignKey("admin_users.id"))
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MensajeContacto(Base):
    __tablename__ = "mensajes_contacto"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre      = Column(String(200), nullable=False)
    email       = Column(String(200), nullable=False)
    telefono    = Column(String(50))
    asunto      = Column(String(200))
    mensaje     = Column(Text, nullable=False)
    leido       = Column(Boolean, default=False)
    created_at  = Column(DateTime, default=datetime.utcnow)
