###JSONP
##A Light Weight JSONP library for Javascript.

```html
<script>

var options = {
    data: { query: "", v: 1 }, 
    error: function(){
      
    },
    success: function(data){
      console.log(data);
    },
    url: url
  };

  JSONP(options);

</script>

```
