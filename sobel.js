const getPexilData = (data) => {
    return (x, y) => {
        const i = (y * data.width + x) * 4;
        return [
            data.data[i] || 0,
            data.data[i + 1] || 0,
            data.data[i + 2] || 0,
            data.data[i + 3] || 0
        ]
    }
}

const sobelX = (data) => {
    const gpd = getPexilData(data);
    return (x, y) => {
        return gpd(x - 1, y - 1)[0] * -1 +
            gpd(x, y - 1)[0] * -2 +
            gpd(x + 1, y - 1)[0] * -1 +
            gpd(x - 1, y + 1)[0] * 1 +
            gpd(x, y + 1)[0] * 2 +
            gpd(x + 1, y + 1)[0] * 1;
    }
}

const sobelY = (data) => {
    const gpd = getPexilData(data);
    return (x, y) => {
        return gpd(x - 1, y - 1)[0] * -1 +
            gpd(x - 1, y)[0] * -2 +
            gpd(x - 1, y + 1)[0] * -1 +
            gpd(x + 1, y - 1)[0] * 1 +
            gpd(x + 1, y)[0] * 2 +
            gpd(x + 1, y + 1)[0] * 1;
    }
}

const sobel = (data) => {
    const sobelx = sobelX(data);
    const sobely = sobelY(data);
    let result = []
    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x++) {
            const i = (y * data.width + x) * 4;
            const sobel = Math.sqrt(sobelx(x, y) ** 2 + sobely(x, y) ** 2);
            const color = sobel > 80 ? 255 : 0;
            result[i] = color;
            result[i + 1] = color;
            result[i + 2] = color;
            result[i + 3] = 255;
        }
    }
    return new ImageData(new Uint8ClampedArray(result), data.width, data.height);
}


export default sobel