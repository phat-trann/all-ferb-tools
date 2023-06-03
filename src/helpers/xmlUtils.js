export const removeExtraNewlines = (xml) => {
    const lines = xml.split('\n');
    const cleanedLines = lines.filter((line) => line.trim() !== '');
    return cleanedLines.join('\n');
};

export const executeFile = async (fileList) =>
    await new Promise((resolve) => {
        const file = fileList[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const xmlString = event?.target?.result || '';

            if (typeof xmlString !== 'string') return;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const root = xmlDoc.documentElement;
            const contents = root.children;
            return resolve([contents, root, xmlDoc]);
        };

        reader.readAsText(file);
    });
