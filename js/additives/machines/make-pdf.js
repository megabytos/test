
(function() {
    function load() {
        var btn = document.createElement('button');
        btn.classList.add("Modalbtn")
        btn.innerText = LANG['SEND'];
        $(btn).insertAfter('#userEmail');

        var fileLoader = document.createElement('input');
        fileLoader.type = 'file';
        fileLoader.accept = "application/pdf";
        fileLoader.onchange = load_file;
        fileLoader.style.display = 'none';
        document.body.appendChild(fileLoader);


        btn.onclick = (function () {
            fileLoader.click();
        });
    }

    $(document).ready(function() {
        load();
    });

    function load_file(e) {
        var file = e.target.files[0];
        var data = new FormData();
        data.append('file', file);
        data.append('action', 'loadPdf');
        data.append('controller', 'Ajax'); //controller: 'Ajax'
        data.append('to', document.getElementById('userEmail').value);
        ShowWait();
        $.ajax({
            type: 'POST',
            url: 'system/controllers/JsonController.php',
            data: data,
            dataType: 'json',
            async: false,
            processData: false, // Не обрабатываем файлы (Don't process the files)
            contentType: false, // Так jQuery скажет серверу что это строковой запрос
            success: function(data){
                CloseWait();
                showMessage(data ? 'Файл успешно отправлен!' : 'Ошибка отправки!');
            }
        })
    }

})();
