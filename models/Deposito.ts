export interface Deposito {
  id: number;
  nombre: string;
  monto: number;
  moneda: string;
  origen: string;
  dominio: string | null;
  mensaje: string;
  canal: string;
  hash: string;
  creado_en: string;
}