$(document).ready(function() {
    $('#startDate, #dueDate').datepicker();

    $('.contests-list').each( function() {
        if ($(this).children().length == 0)
            $(this).prev('h2').hide();
    });
});


function ContestsCtrl($scope){
    if(typeof getContestInitData == "function"){
        $scope.title = getContestInitData().title;
        $scope.alias = getContestInitData().alias;
    }

    var need_to_translit = true;

    if($scope.title && $scope.alias && translit($scope.title) !== $scope.alias){
        need_to_translit = false;
    }

    $scope.disableTranslit = function(){
        need_to_translit = false;
    }

    $scope.createAlias = function(){
        if(need_to_translit || !$scope.alias){
            $scope.alias = translit($scope.title);
            need_to_translit = true;
        }
    };
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