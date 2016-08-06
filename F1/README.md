#图片轮播插件文档
##插件描述
  lunboPlugin是以jQuery为基础的html图片轮播插件，使用时需要jQuery框架。
  在使用插件时只需要传入包含图片容器的父级容器即可。
  该插件支持设置图片轮播的时间间隔，默认为3s；支持触屏滑动等事件；支持自定义切换当前显示的图片。
  用户可以通过监听鼠标的点击、移动等事件并对插件的图片切换函数进行绑定即可实现自定义切换当前显示的图片。
  在使用时只需要在父级容器调用lunbo(arguments）方法即可，该插件继承了jQuery的chainable属性，支持链式使用。

###实现功能
  1.传入图片父级容器，可添加任意多张图片
  2.根据图片数目自动添加底部显示数目和状态的示数栏
  3.自定义底部示数栏的样式
  4.开始和暂停轮播
  5.监听屏幕滑动事件 左滑和右滑切换图片
  6.上一张和下一张
  7.返回当前元素的index
  8.跳转到指定的图片
  9.报错功能

###实现函数
  1.初始化  lunbo("init") 或 lunbo()
  2.设置底部示数标签样式  lunbo（"setNumStyle",{options}）
  3.开始和暂停轮播   lunbo("resume") lunbo("stop")
  4.上一张和下一张  lunbo("prev"） lunbo("next"）
  5.触屏切图   lunbo("setSwipeSwitch")
  6.鼠标拖拽切图   lunbo("setDragSwitch")
  6.返回当前元素索引号：lunbo("current")  *注意！调用此方法后将不支持链式操作
  7.跳转到指定的图片 lunbo(index)

##插件使用示例说明

###html文档准备：
            我们首先需要创建一个html文档，并构建一个一级父级容器

                //在使用插件前需要引入jQuery库以及插件js文件和插件css文件
                       <script src="jquery.min.js"></script>        //本插件需要jQuery库的支持
                       <script src="LunboPlugin.js"></script>       //插件在jQuery库之后引入
                        <link href="lunbo.css" rel="stylesheet" type="text/css">

                //html文档
                       <div class="lunbo-container" id="container">     //父级主容器添加class="lunbo-container"属性
                                     <div class="image-container">            //图片容器添加class="image-container"属性
                                          <ul>
                                              <li><a href="#"><img src="1.jpg"></a></li>
                                              <li><a href="#"><img src="2.jpg"></a></li>
                                              <li><a href="#"><img src="3.jpg"></a></li>
                                              <li><a href="#"><img src="4.jpg"></a></li>
                                              <li><a href="#"><img src="5.jpg"></a></li>
                                              <li><a href="#"><img src="6.jpg"></a></li>
                                          </ul>
                                     </div>
                                 </div>

###调用插件函数设置图片轮播

        1.初始化：
                通过上述的一级父容器进行调用初始化方法即可，非常的简单，如下代码

                 var myLunbo = $("#container").createLunbo();

                 这里的#container是轮播框架的一级父容器的id属性，初始化只需通过jQuery找到该父级容器并调用lunbo（）方法即可
                 插件会通过init()函数自动识别该父级容器，并获取内部包含的图片张数

                 含有参数的插件初始化

                  var myLunbo2 = new $("#lunbo2").createLunbo(
                                         {
                                           number : true,         //设置是否显示示数栏，默认显示
                                           button : true,         //设置是否显示按钮，默认显示
                                           interval : 3000,       //设置轮播时间间隔，默认三秒
                                           swipeSwitch : true,    //设置是否启用触屏切图功能，默认开启
                                           dragSwitch : true,     //设置是否启用拖动图片切图，默认开启
                                           switchEffect : "card", //设置是图片切换特效，可选card/fade/none 默认fade
                                           autoShow : true,       //设置是否自动轮播，默认开启
                                           hoverStop : true,      //设置鼠标悬浮在图片上时是否暂停轮播，默认开启
                                           numStyle : "circle"    //设置示数栏风格 提供rect/circle选项，默认rect
                                           onSwitchStart : function(event,index) {}  //开始切换图片时的回调函数
                                           onSwitchEnd : function(event,index) {}    //图片切换结束后的回调函数
                                           });

        2.设置图片自动轮播
                在初始化完成后就可以为图片设置开始轮播，由于插件支持链式操作，所以可以在刚才的代码上继续添加函数，如下

                $("#container").createLunbo()
                               .lunbo("stop")    //暂停轮播
                               .lunbo("resume"); //恢复轮播
                               .lunbo(3)         //转跳到第4张图片

        3.设置触屏滑动屏幕切换图片（该方法对不支持触屏的硬件无效）
                 非常简单，只需要再刚才的基础上继续链式调用如下方法

                 var myLunbo=$("#container").createLunbo()
                             .lunbo("setSwipeSwitch",true)  //好了，如果设备支持触屏，那么现在就已经具有了滑动屏幕切换图片的功能，左滑上一张，右滑下一张

                 //实际上触屏切图功能是默认开启的，我们可以如下代码关闭

                 myLunbo.lunbo("setSwipeSwitch",false)      //同理，拖拽切图也是一样的


        4.暂停图片轮播
                只需在lunbo()内传入"stop"参数即可，如下

                myLunbo.lunbo("stop");


        5.切换图片上一张/下一张
                通过传入"prev"参数 或 "next"参数来设置播放当前正在显示图片的上一张或下一张

                .lunbo("prev");  //显示上一张
                myLunbo.lunbo("next");  //显示下一张


        6.显示示数栏和按钮
                //初始化时不显示

                var myLunbo =   $("#container").createLunbo({"button":false,"number",false});

                //通过调用函数实现显示按钮和示数栏

                myLunbo.lunbo("setButton",true).lunbo("setNumber",true) //bool值可以不传入，因为插件默认值就是true

        7.为示数栏设置自定义样式
                插件内为示数栏内设置了默认的CSS样式，预设rect和circle两种类型，初始化时传入即可

                var myLunbo =   $("#container").createLunbo({"numStyle","rect"});

                或者通过函数改变

                myLunbo.lunbo("setNumStyle","circle"});

                自定义示数栏样式

                我们只需要在自己的CSS文件上写示数栏的样式即可，后把改CSS样式的名字传入即可
                例如写了一个CSS样式如下：
                    .myCSS{
                             width: 20px;
                             height: 20px;
                             background-color: blue;
                            }
                要让示数栏显示该样式只需一步：

                myLunbo.lunbo("setNumStyle","myCSS"});

        8.返回指定节点在同辈中的索引号

               var index = myLunbo.("current");

        9.显示指定的图片
                自定义显示指定的图片，实现代码如下

                $("#container").lunbo(3)

                这行代码将使之前正在显示的图片切换到第四张图片

        10.设置播放间隔

                myLunbo.lunbo("setInterval",5000);

                第二个参数是播放的时间间隔，以毫秒为单位，插件默认3秒