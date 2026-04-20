export default function Files() {
    async function getUpload() {
        try {
            const res = await fetch('http://localhost:3000/fileWithCookie/my-images', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.text();
            document.getElementById('result').innerText = data;
            if (data.startsWith('/file/')) {
                document.getElementById('preview').src = data.url;
            }
        } catch (err) {
            console.error(err);
        }
    }
    async function upload() {
        const input = document.getElementById('fileInput');
        const file = input.files[0];
        const id = input.id.split('-')[0];
        if (!file) {
            alert('Выбери файл');
            return;
        }
        preview.src = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('http://localhost:3000/fileWithCookie/save', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.text();
            document.getElementById('result').innerText = data;
            if (data.startsWith('/file/')) {
                document.getElementById('preview').src = data.url;
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h2>Upload File (Base63)</h2>
            <input type="file" id="fileInput" />
            <button onClick={upload}>Upload</button>
            <h2>Get Upload Files</h2>
            <button onClick={getUpload}>Get All</button>
            <p id="result"></p>
            <img id="preview" width="200" />
        </div>
    )
}