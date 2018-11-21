function ajax() {
    var xhr = null
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Miscroft XMLHTTP')
    }
    var url = ""
    var type = data.type == "get" ? "get" : "post"
    if (url,data) {
        url += "?" + data.data + "&_t" + new Date().getTime()
    }
    var flag = data.async == "true" ? "true" : "false"
    xhr.open(url,type,flag)

    if (type == "get") {
        xhr.send(null)
    } else if (type == "post") {
        xhr.setRequestHeader()
        xhr.send(data.data)
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (typeof data.success == "function") {
                    var d = data.dataType == "XML" ? xhr.responseXML : xhr.responseText
                    data.success(d)
                } else if (typeof data.failure == "function") {
                    data.failure()
                }
            }
        }
    }
}