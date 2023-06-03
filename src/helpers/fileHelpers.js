import { removeExtraNewlines } from "./xmlUtils";

export const downloadXMLfile = async (xmlDoc, fileName) => 
    await new Promise((resolve) => {
        const serializedXml = new XMLSerializer().serializeToString(xmlDoc);
        const cleanedXml = removeExtraNewlines(serializedXml);
        const blob = new Blob([cleanedXml], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'sampleFile' + '.xml';
        a.click();

        URL.revokeObjectURL(url);
        resolve();
    });