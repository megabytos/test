/**
 * Created by Dima on 11/8/2018.
 */
class API {
    static auth(email, password) {
        $.ajax({
            type: "POST",
            url: "/service/system/controllers/JsonController.php",
            data: ({
                controller: 'RequestsForDb3d', action: 'auth', email: email, password: password,
            }),
            dataType: 'json',
            success: function (data) {
                if(data == 'SuccessFull') {
                    location.reload();
                }else{
                    console.error(data);
                }
            },
        });
    }
}
