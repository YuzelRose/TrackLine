import Compra from "../models/ShopModel.js";
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";

export const regisSell = async (req, res) => {
    const { Mail, IDRef, paymentData } = req.body;

    if (!Mail || !IDRef || !paymentData || !paymentData.purchase_units) {
        return res.status(400).json({ message: "Faltan datos obligatorios (Mail, IDRef o paymentData)." });
    }

    try {
        const newCompra = new Compra({
            UserMail: Mail,
            IDRef: IDRef,
        });

        // Guardar en la base de datos
        await newCompra.save();

        // Enviar el recibo por correo
        await sendPurchaseReceipt(paymentData, Mail);

        res.status(201).json({ message: "Compra registrada exitosamente.", data: newCompra });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar la compra.", error: error.message });
    }
};

const sendPurchaseReceipt = async (paymentData, email) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: "librosmaldonado68@gmail.com",
            pass: "xzym wpfq kwms gbdj",
        },
    });

    const generatePDF = (paymentData) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Recibo de Compra", 20, 20);

        const purchaseUnit = paymentData.purchase_units[0];
        let yPosition = 40;

        doc.setFontSize(12);
        doc.text(`Referencia: ${purchaseUnit.reference_id}`, 20, yPosition);
        yPosition += 10;

        doc.text("Detalles de la Compra:", 20, yPosition);
        yPosition += 10;

        purchaseUnit.items.forEach((item) => {
            doc.text(`${item.name}`, 20, yPosition);
            doc.text(`Cantidad: ${item.quantity}`, 140, yPosition);
            doc.text(`Precio: ${item.unit_amount.currency_code} ${item.unit_amount.value}`, 200, yPosition);
            yPosition += 10;

            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        yPosition += 10;
        doc.text(`Total: ${purchaseUnit.amount.currency_code} ${purchaseUnit.amount.value}`, 20, yPosition);

        return doc.output("arraybuffer");
    };

    try {
        const pdfBuffer = generatePDF(paymentData);

        const mailOptions = {
            from: {
                name: "Libros Maldonado",
                address: "librosmaldonado68@gmail.com",
            },
            to: email,
            subject: "Recibo de su compra en Libros Maldonado",
            html: `
                <p>Gracias por su compra en <strong>Libros Maldonado</strong>.</p>
                <p>Adjunto encontrará su recibo de compra. Si tiene alguna pregunta, no dude en ponerse en contacto con nosotros.</p>
            `,
            attachments: [
                {
                    filename: "voucher-compra.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado exitosamente.");
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
};
