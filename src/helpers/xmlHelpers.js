export const getAllLocale = async (contents) =>
    await new Promise((resolve) => {
        let localeObject = {};

        for (const content of contents) {
            for (const childNode of content.children) {
                const langAttribute = childNode.attributes?.['xml:lang']?.value;

                if (langAttribute) {
                    localeObject = {
                        ...localeObject,
                        [langAttribute]: true
                    };
                } else if (childNode.children.length > 0) {
                    for (const subChildNote of childNode.children) {
                        const subLangAttribute = subChildNote.attributes?.['xml:lang']?.value;

                        if (subLangAttribute) {
                            localeObject = {
                                ...localeObject,
                                [subLangAttribute]: true
                            };
                        }
                    }
                }
            }
        }

        resolve(Object.keys(localeObject));
    });

export const keepAllContentByLocale = async (contents, root, selectedLocale) =>
    await new Promise((resolve) => {
        for (let i = contents.length - 1; i >= 0; i--) {
            let isKeep = false;
            const content = contents[i];

            for (let j = content.children.length - 1; j >= 0; j--) {
                const childNode = content.children[j];
                const langAttribute = childNode.attributes?.['xml:lang']?.value;

                if (langAttribute !== selectedLocale) {
                    if (childNode.children.length > 0) {
                        let isRemove = true;

                        for (let k = childNode.children.length - 1; k >= 0; k--) {
                            const subChildNote = childNode.children[k];
                            const subLangAttribute = subChildNote.attributes?.['xml:lang']?.value;

                            if (subLangAttribute === selectedLocale) {
                                isRemove = false;
                                isKeep = true;
                            } else {
                                childNode.removeChild(subChildNote);
                            }
                        }

                        if (isRemove) {
                            content.removeChild(childNode);
                        }
                    } else {
                        content.removeChild(childNode);
                    }
                } else {
                    isKeep = true;
                }
            }

            if (!isKeep) {
                root.removeChild(content);
            }
        }

        resolve();
    })
