
const getImageSrc = (file) => {
    return new Promise((resolve) => {
        const fileLoader = new FileReader();
        fileLoader.onload = (e) => {
            resolve(e.target.result);
        }
        fileLoader.readAsDataURL(file)
    }
    )
}


export default getImageSrc;