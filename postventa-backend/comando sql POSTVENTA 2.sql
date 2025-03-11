select * from ventas;
CREATE TABLE ventas (
    venta_id SERIAL PRIMARY KEY,
    cliente_id INT,  -- Cliente que realizó la compra (puede ser NULL si es venta rápida)
    empleado_id INT,  -- Empleado que realizó la venta
    total DECIMAL(10,2) NOT NULL,  -- Total bruto sin impuestos ni descuentos
    descuento DECIMAL(10,2) DEFAULT 0, -- Descuento aplicado a la venta
    impuestos DECIMAL(10,2) DEFAULT 0, -- Impuestos aplicados a la venta
    total_neto DECIMAL(10,2) GENERATED ALWAYS AS (total - descuento + impuestos) STORED, -- Total final
    metodo_pago VARCHAR(20) NOT NULL,  -- Solo un campo VARCHAR sin validación directa en la base de datos
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'pagado', 'cancelado')),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de la venta
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE SET NULL,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id) ON DELETE SET NULL
);
INSERT INTO ventas (cliente_id, empleado_id, total, descuento, impuestos, metodo_pago, estado, fecha)
VALUES
    (1, 2, 150.00, 10.00, 5.00, 'efectivo', 'pendiente', CURRENT_TIMESTAMP),
    (2, 3, 200.00, 20.00, 8.00, 'tarjeta', 'pagado', CURRENT_TIMESTAMP);  

select * from clientes;
select * from detalle_venta;
CREATE TABLE detalle_venta (
    detalle_id SERIAL PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio) STORED,  -- Calcula automáticamente el subtotal
    FOREIGN KEY (venta_id) REFERENCES ventas(venta_id) ON DELETE CASCADE,  -- Asegura que se borren los detalles si se elimina la venta
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE  -- Asegura que se borren los detalles si se elimina el producto
);
INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio)
VALUES
    (3, 23, 2, 50.00 ),  
    (3, 24, 1, 50.00),
    (4, 23, 3, 60.00),  
    (4, 24, 2, 10.00);   



CREATE TABLE historial_ventas (
  ventahistorial_id SERIAL PRIMARY KEY,                     -- Usamos SERIAL en lugar de AUTO_INCREMENT
  cliente_id INT NOT NULL,                         -- ID del cliente que realiza la compra
  empleado_id INT NOT NULL,                        -- ID del empleado que realizó la venta
  total DECIMAL(10, 2) NOT NULL,                   -- Total de la venta
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- Fecha y hora de la venta
  metodo_pago VARCHAR(50),                         -- Método de pago
  estado VARCHAR(20),                              -- Estado de la venta
  descuento DECIMAL(10, 2),                        -- Descuento aplicado a la venta
  cupon_codigo VARCHAR(50),                        -- Código del cupón aplicado
  observaciones TEXT,                              -- Observaciones adicionales
  CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
  CONSTRAINT fk_empleado FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);
INSERT INTO historial_ventas (
  cliente_id,
  empleado_id,
  total,
  metodo_pago,
  estado,
  descuento,
  cupon_codigo,
  observaciones
)
VALUES
  (1, 2, 100.00, 'tarjeta', 'completada', 10.00, 'CUPO2025', 'Venta realizada con tarjeta de crédito'),
  (3, 2, 50.00, 'efectivo', 'pendiente', 5.00, 'CUPO2025', 'Pago en efectivo, pendiente de verificación');
select * from historial_ventas



select * from productos;
