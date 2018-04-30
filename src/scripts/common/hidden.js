function hidden () {
    var input = document.querySelectorAll('.layer-chk--input');

    

    for (var i = 0; i < input.length; i++ ){
       
        input[i].addEventListener("click", function(e){
            var dataAtr = this.getAttribute('data-attr');

            var dataAttrVis = document.querySelector(dataAtr);
            
            dataAttrVis.classList.add("layer-active");

            setTimeout(function () {
                dataAttrVis.style.display = 'none';
            }, 1100);
           


        });
    }
    }
module.exports = hidden;