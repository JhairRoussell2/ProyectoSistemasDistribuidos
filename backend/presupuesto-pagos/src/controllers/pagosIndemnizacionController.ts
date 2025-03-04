import { Request, Response } from "express";
import ejs from "ejs";
import path from "path";
import puppeteer from "puppeteer";
import pool from "../config/db";
class pagosIndemnizacionController {
    // Obtener datos importantes de presupuestos validados y pagados
    public async getIndemnizaciones(req: Request, res: Response): Promise<void> {
        try {
            // Llamada a la función 'get_indemnizaciones()' que devuelve todos los datos necesarios
            const result = await pool.query("SELECT * FROM public.get_indemnizaciones()");
            res.json((result as any).rows);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener las indemnizaciones", error });
        }
    }
    // Actualizar estado de un presupuesto a "Pagado" si estaba en "Validado"
    public async updateEstadoAPagado(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "Se requiere id" });
                return;
            }

            const result = await pool.query(
                "UPDATE presupuesto SET estado = 'Pagado' WHERE presupuestoid = $1 AND estado = 'Validado' RETURNING *",
                [id]
            );

            if (result.rowCount === 0) {
                res.status(400).json({ message: "Presupuesto no encontrado o no está en estado 'Validado'" });
            } else {
                const presupuesto = result.rows[0];
                res.json({
                    message: `El pago de indemnización para el siniestro SIN-${presupuesto.siniestroid} por un monto de S/.${presupuesto.montototal} ha sido procesado correctamente.`,
                    data: presupuesto
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el estado", error });
        }
    }
    public async generatePdf(req: Request, res: Response): Promise<void> {
      const { id } = req.params;
      try {
        const query = `SELECT * FROM obtener_datos_factura($1)`;
        const result = await pool.query(query, [id]);
    
        if (result.rows.length === 0) {
          res.status(404).json({ message: "Presupuesto no encontrado" });
          return;
        }
    
        const datosFactura = result.rows[0];
    
        // Lee el archivo 'logo.png' y lo convierte a Base64
        const templatePath = path.join(__dirname, "..", "views", "factura.ejs");
        // 2. Renderizar la plantilla EJS, pasando la imagen como base64
        const htmlContent = await ejs.renderFile(templatePath, {
          beneficiario: {
            nombre: datosFactura.beneficiario_nombre,
            apellido: datosFactura.beneficiario_apellido,
            dni: datosFactura.beneficiario_dni,
            telefono: datosFactura.beneficiario_telefono,
            email: datosFactura.beneficiario_email
          },
          poliza: { tipopoliza: datosFactura.tipopoliza },
          presupuesto: {
            montototal: datosFactura.montototal,
            fechacreacion: datosFactura.fechacreacion
          },
          taller: {
            nombre: datosFactura.taller_nombre,
            direccion: datosFactura.taller_direccion,
            telefono: datosFactura.taller_telefono
          },
          vehiculo: {
            marca: datosFactura.vehiculo_marca,
            modelo: datosFactura.vehiculo_modelo,
            tipo: datosFactura.vehiculo_tipo,
            placa: datosFactura.vehiculo_placa
          }
        });
    
        // 3. Generar el PDF con Puppeteer
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: puppeteer.executablePath(),
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-software-rasterizer"
          ],
        });
    
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4" });
        await browser.close();
    
        // 4. Enviar el PDF al cliente
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=factura.pdf");
        res.end(pdfBuffer);
        
      } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).json({ message: "Error al generar el PDF", error });
      }
    } 
}
export default new pagosIndemnizacionController();