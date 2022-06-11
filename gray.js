const gray = (data) => {
    const result = [];
    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x++) {
            const i = (y * data.width + x) * 4;
            const gray = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
            result[i] = gray;
            result[i + 1] = gray;
            result[i + 2] = gray;
            result[i + 3] = 255;
        }
    }
    return new ImageData(new Uint8ClampedArray(result), data.width, data.height);
}

export default gray