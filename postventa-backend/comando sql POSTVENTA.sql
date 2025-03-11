select * from categorias;

select * from detalles_venta;

select * from ventas;
	


	


CREATE TABLE categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT null,
    descripcion VARCHAR(255) null
);


-- Insertar categorías para la tienda de consumo masivo
INSERT INTO categorias (nombre, descripcion)
VALUES
('Alimentos', 'Productos alimenticios como cereales, arroz, pasta, etc.'),
('Bebidas', 'Bebidas refrescantes, jugos, agua, gaseosas, etc.'),
('Limpieza', 'Productos para limpieza del hogar, detergentes, esponjas, etc.'),
('Higiene personal', 'Productos para la higiene personal, como jabones, shampoo, etc.'),
('Electrónica', 'Artículos electrónicos como auriculares, cargadores, etc.'),
('Cuidado del hogar', 'Productos para cuidado y mantenimiento del hogar, como papel higiénico, etc.');


-- Insertar productos correspondientes a cada categoría
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id)
VALUES
-- Alimentos
('Arroz', 'Arroz de grano largo, 1 kg', 1.50, 100, 1),
-- Bebidas
('Coca-Cola', 'Refresco Coca-Cola, 2L', 2.00, 150, 2),
-- Limpieza
('Detergente líquido', 'Detergente líquido para ropa, 1L', 1.20, 50, 3),
-- Higiene personal
('Jabón líquido', 'Jabón líquido para manos, 500 ml', 1.00, 80, 4),
-- Electrónica
('Auriculares Bluetooth', 'Auriculares inalámbricos con Bluetooth', 15.00, 30, 5),
-- Cuidado del hogar
('Papel higiénico', 'Papel higiénico, 12 rollos', 3.00, 200, 6);

select * from categorias c ;
select * from productos p ;
select * from clientes c;


CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
);


CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT
);

INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Juan Pérez', 'juan.perez@example.com', '0987654321', 'Calle Principal 123, Quito'),
('María López', 'maria.lopez@example.com', '0991234567', 'Av. Amazonas 456, Guayaquil'),
('Carlos Rodríguez', 'carlos.rodriguez@example.com', '0975432189', 'Calle Bolívar 789, Cuenca'),
('Ana Torres', 'ana.torres@example.com', '0998765432', 'Av. 6 de Diciembre 321, Quito'),
('Luis Gómez', 'luis.gomez@example.com', '0961237894', 'Calle Sucre 654, Loja');

select  * from ventas;


CREATE TABLE empleados (
    empleado_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    puesto VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(20)
);

INSERT INTO empleados (nombre, puesto, email, telefono) 
VALUES 
    ('Juan Pérez', 'Gerente', 'juan.perez@example.com', '0987654321'),
    ('María López', 'Asistente', 'maria.lopez@example.com', '0991234567'),
    ('Carlos Torres', 'Cajero', 'carlos.torres@example.com', '0981122334');



CREATE TABLE ventas (
    venta_id SERIAL PRIMARY KEY,
    cliente_id INT,
    empleado_id INT,
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);




ALTER TABLE ventas 
ADD COLUMN total_neto DECIMAL(10,2);



metodo_pago → Para definir el método de pago utilizado en la venta.
estado → Para manejar el estado de la venta (pendiente, pagado, cancelado).
descuento (opcional) → Para registrar descuentos aplicados a la venta.
impuestos (opcional) → Para almacenar los impuestos aplicados a la venta.
total_neto → Para guardar el total después de aplicar impuestos y descuentos.





INSERT INTO ventas (cliente_id, empleado_id, total) 
VALUES 
    (1, 3, 150.75), 
    (3, 3, 250.50);


CREATE TABLE detalles_venta (
    detalle_id SERIAL PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(venta_id),
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
);


CREATE TABLE pagos (
    pago_id SERIAL PRIMARY KEY,
    venta_id INT,
    metodo_pago VARCHAR(50),
    monto DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(venta_id)
);


CREATE TABLE inventarios (
    inventario_id SERIAL PRIMARY KEY,
    producto_id INT,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_operacion VARCHAR(50), -- "entrada" o "salida"
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
);



Esta tabla almacena la configuración básica del sistema, como impuestos, descuentos, etc.
CREATE TABLE configuracion (
    config_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    valor VARCHAR(255)
);



Relaciones y Claves Foráneas
productos: Relacionado con categorias (un producto puede tener una categoría).
ventas: Relacionado con clientes y empleados (quién realizó la venta y quién la compró).
detalles_venta: Relacionado con ventas y productos (qué productos se vendieron en cada venta).
pagos: Relacionado con ventas (cómo se pagó la venta).
inventarios: Relacionado con productos (para controlar el stock).
Resumen
Estas tablas cubren los aspectos fundamentales para gestionar un punto de venta profesional, incluyendo el manejo de productos, ventas, pagos y clientes. Puedes extender y modificar este esquema según los requerimientos adicionales de tu negocio, como descuentos, promociones o facturación.

