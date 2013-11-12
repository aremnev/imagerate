$(document).ready(function() {
    $('#startDate, #dueDate').datepicker();
});


function ContestsCtrl($scope){
    $scope.title = document.querySelector("input[name=title]").defaultValue;
    $scope.alias = translit($scope.title);

    $scope.createAlias = function(){
        $scope.alias = translit($scope.title);
    }
}

function translit(str){
    var dictionary, result = "";
    dictionary = {
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ё': 'e',
        'ж': 'zh',
        'з': 'z',
        'и': 'i',
        'й': 'i',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'kh',
        'ц': 'tc',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'shch',
        'ъ': '',
        'ы': 'y',
        'ь': '',
        'э': 'e',
        'ю': 'iu',
        'я': 'ia'
    };
    if(str){
        var length = str.length;
        for(var i= 0; i < length; i++){
            var char = str[i].toLowerCase();
            if( dictionary[char] ){
                result += dictionary[char];
            }else{
                if(/[a-zA-Z0-9]/.test(char)){
                    result += char;
                }else{
                    result += '_';
                }

            }
        }
    }

    return result;
}