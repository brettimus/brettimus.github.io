# This can be improved!

```scss
.bg {

  -webkit-filter: blur(4px);
  -moz-filter: blur(4px);
  -o-filter: blur(4px);
  -ms-filter: blur(4px);
  filter: blur(4px);

  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}

.fg {
  background: transparent;
  padding: 40px 0 20px 40px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}


```


## Try this!

```scss
.content {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 0;
  margin-left: 20px;
  margin-right: 20px;

  &:before {
    content: "";
    position: fixed;
    left: 0;
    right: 0;
    z-index: -1;
    
    display: block;
    background-image: url('./horse.jpg');
    width: 1200px;
    height: 800px;
    
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -o-filter: blur(5px);
    -ms-filter: blur(5px);
    filter: blur(5px);
  }
}