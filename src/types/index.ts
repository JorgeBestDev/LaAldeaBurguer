export interface Producto {
  idProducto: string;
  nombreProducto: string;
  precioProducto: string;
  tipoProducto: string;
}

export interface DetalleVenta {
  idDetalle: string;
  idVenta: string;
  idProducto: string;
  cantidadProducto: string;
  precioUnitario: string;
  subtotalVenta: string;
  producto?: Producto;
}

export interface Venta {
  idVenta: string;
  fechaVenta: string;
  totalVenta: string;
  detalles?: DetalleVenta[];
}

export interface Estadisticas {
  productoMasVendido: {
    nombreProducto: string;
    cantidadTotal: string;
  } | null;
  ventaMasAlta: {
    idVenta: string;
    fechaVenta: string;
    totalVenta: string;
  } | null;
  ventasPorDiaSemana: {
    dia: string;
    total: string;
    cantidadVentas: number;
  }[];
  resumen: {
    totalVentasRegistradas: number;
    ingresoTotal: string;
  };
}

export interface LineaVentaInput {
  idProducto: string;
  cantidadProducto: number;
}

export interface CrearVentaInput {
  fechaVenta: string;
  lineas: LineaVentaInput[];
}
