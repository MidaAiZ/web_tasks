#图片轮播插件文档
##插件描述
  lunboPlugin是以jQuery为基础的html图片轮播插件，使用时需要jQuery框架。
  在使用插件时只需要传入包含图片容器的父级容器，并未图片列表的li标签设置data-role="image-list"属性即可。
  该插件支持设置图片轮播的时间间隔，默认为2s；支持触屏滑动等事件；支持自定义切换当前显示的图片。
  用户可以通过监听鼠标的点击、移动等事件并对插件的图片切换函数进行绑定即可实现自定义切换当前显示的图片。
  本插件的使用是建立在用户传入的html标签上的，本插件不会自动为html创建图片轮播的标签框架及其CSS样式。
  在使用时只需要在父级容器调用lunbo(arguments）方法即可，该插件继承了jQuery的chainable属性，支持链式使用。

###实现功能
  1.传入图片父级容器，可添加任意多张图片
  2.根据图片数目自动添加底部显示数目的list标签（需给定list父容器）
  3.自定义底部数字标签的样式
  4.开始和暂停轮播
  5.监听屏幕滑动事件 左滑和右滑切换图片
  6.上一张和下一张
  7.返回当前元素的index
  8.跳转到指定的图片
  9.报错功能

###实现函数
  1.初始化  lunbo("init") 或 lunbo()
  2.设置底部示数标签样式  lunbo（"setNumStyle",{options}）
  3.开始和暂停轮播   lunbo("startShow") lunbo("stopShow")
  4.触屏滑动   lunbo("onSlide")
  5.上一张和下一张  lunbo("prev"） lunbo("next"）
  6.返回当前元素索引号：lunbo("getIndex")  *注意！调用此方法后将不支持链式操作
  7.跳转到指定的图片 lunbo("" goto")

##插件使用示例说明

###html文档准备：
            你需要创建一个html文档，并构建一个一级父级容器用于存放图片列表和一些其它控件的次级父级容器，
                例如：
                      <div id="container">  //一级父级容器  建议设置id="container"属性
                             <div class=img-container>
                                //此处添加存放图片的<ul>和<li>标签
                             </div>
                             <div class="num-container">    //二级父级容器
                                   //此处添加用于显示图片张数及显示状态的ul标签
                             </div>
                             <div class="btn-container">  //二级父级容器
                                   //此处放置控制按钮标签
                             </div>
                             <div class="anyother">    //二级父级容器
                                   //您可以添加其它一切你想添加的元素
                                   // ...
                             </div>
                         </div>

            您需注意的是必须要为存放图片的<li>标签设置data-role="image-list"属性，插件通过这个属性来获取图片张数
                例如：
                    <div class="num-container">
                           <ul>
                                <li data-role="image-list">    //未设置该属性插件将无法找到需要轮播的图片
                                    <a href="#" alt><img src="location"></a>
                                    //...
                                </li>
                           </ul>
                    </div>
            如果您需要添加用来显示图片张数以及图片显隐状态的示数栏，需要在一级父容器内（或其子级容器内）添加一个<ul>标签
            并且为<ul>标签设置data-role="number-container属性"
                 例如：
                     <div class="num-container">    //二级父容器
                           <ul data-role="number-container">  //您需要自己为该ul容器设置CSS样式
                                //这里建议不要再添加其它元素 插件会自动在此添加标签
                           </ul>
                     </div>
            值得注意的是您并不需要在该ul标签内写入任何标签，插件将根据图片张数在ul标签内自动添加li标签并为li标签设置插件默认CSS属性，
            您可以在插件的setNumStyle中设置li标签的自定义CSS样式，但是ul标签的样式却需要您自己设置，如未设置可能无法正确显示
            注意：如果<ul>标签未设置data-role="number-container属性"插件将无法识别该<ul>标签的作用继而无法添加示数栏！

###调用插件函数设置图片轮播

        1.初始化：
                通过上述的一级父容器进行调用初始化方法即可，非常的简单，如下代码

                 $("#container").lunbo();

                 这里的#container是轮播框架的一级父容器的id属性，初始化只需通过jQuery找到该父级容器并调用lunbo（）方法即可
                 插件会通过init()函数自动识别该父级容器，并获取内部含data-role="imge-list"的li标签个数，以此作为轮播图片的张数
                 如在该父级容器内不含data-role="imge-list"的li标签，插件将报错。

        2.设置图片自动轮播
                在初始化完成后就可以为图片设置开始轮播，由于插件支持链式操作，所以可以在刚才的代码上继续添加函数，如下

                $("#container").lunbo()
                               .lunbo("startShow");

                只需要在lunbo()内传入字符串"startShow"图片就可以实现以2s为间隔的自动轮播，同时还指定轮播间隔，传入间隔毫秒数即可

                $("#container").lunbo()
                               .lunbo("startShow",3000);    //在"startShow"后传入毫秒数3000即可设置自动轮播的事件间隔为3s

        3.设置触屏滑动屏幕切换图片（该方法对不支持触屏的硬件无效）
                 非常简单，只需要再刚才的基础上继续链式调用如下方法

                 $("#container").lunbo()
                                .lunbo("startShow",3000)
                                .lunbo("onSlide")
                 好了，如果设备支持触屏，那么现在就已经具有了滑动屏幕切换图片的功能，左滑上一张，右滑下一张

        4.暂停图片轮播
                只需在lunbo()内传入"stopShow"参数即可，如下

                $("#container").lunbo("stopShow");

                调用该方法后图片就会停止轮播，您可以在html内添加一些标签并为其绑定事件来控制图片的轮播开始与结束
                例如可以设置当鼠标移入图片内时停止轮播，移出时开始轮播，通过绑定hover事件即可实现，代码如下

                $("[data-role='image-list'").hover(
                                                    function(){$("#container").lunbo("stopShow")} , //鼠标移入时调用的函数
                                                    function(){$("#container").lunbo("startShow",2000)} //鼠标移出时调用的函数
                                                    );

        5.切换图片上一张/下一张
                通过传入"prev"参数 或 "next"参数来设置播放当前正在显示图片的上一张或下一张

                .lunbo("prev");  //显示上一张
                $("#container").lunbo("next");  //显示下一张

                建议通过对事件的监听来控制播放上一张/下一张，从而优化交互体验，例如通过对按钮的点击事件监听来实现切换图片的功能
                代码如下

                $(".left-btn").bind("click" , function(){$.fn.lunbo("prev")});    //左边按钮绑定点击事件，切换到上一张
                $(".right-btn").bind("click" , function(){$.fn.lunbo("next")});   //右边按钮绑定点击事件，切换到下一张

                当然，这些按钮标签或者其他控件标签是需要自己定义的，通过绑定事件来实现插件的功能，插件本身不会自动添加这些控件

        6.设置显示轮播图片数目的及显示状态的示数栏
                如果您希望用户知道正在轮播的图片张数以及目前显示的是第几张图片，那么示数栏是必不可少的控件
                lunboPlugin插件支持示数栏的创建，并且内建了默认样式。
                设置示数栏只需要在父级容器中添加以下子容器，并设置data-role="number-container"的属性：

                    <ul data-role="number-container">  //您需要自己为该ul容器设置CSS样式，如未设置样式示数栏可能无法正确显示
                         //插件将自动根据图片的张数在此添加对应的<li>标签并为<li>标签设置默认CSS样式
                    </ul>

                在示数栏中，每张图片对应一个<li>标签，图片显示与否对应的<li>标签会显示不同的样式
                当然，并非一定要用<ul>标签来存放示数栏，这里只是建议。实际上只需设置了data-role="number-container"属性的容器即可。
                设置示数栏并不需要单独调用任何函数，只需初始化时调用lunbo("init")函数的节点内含data-role="number-container"属性的子节点即可
                若初始化时调用lunbo("init")函数的节点内不含data-role="number-container"属性的子节点，插件将不会创建示数栏

        7.为示数栏设置自定义样式
                插件内为示数栏内的元素(即<li>标签)设置了默认的CSS样式，默认样式表如下：

                 defaultsCSS : {
                      "normalCSS": {
                                    "list-style" : "none",   //normalCSS为图片在未显示状态下示数栏中对应<li>标签的样式
                                    "display" : "inline-block",
                                    "width" : "15px",
                                    "height" : "15px",
                                    "margin" : "5px",
                                    "border-radius" : "50%",
                                    "background" : "black",
                                    "opacity" : "0.7",
                                    "color" : "white",
                                    "text-align" : "center",
                                    "cursor" : "pointer"
                                    },
                      "activeCSS" : {
                                    "background":"red"
                                     }   //activeCSS为图片在显示状态下示数栏中对应<li>标签的样式
                        },

                 更改默认样式，具体实现代码如下：

                        $("#container").lunbo("setNumStyle",{
                            "defaultsCSS" : {
                                             "width" : "10px",
                                              "height" : "10px",
                                              "background" : "yellow"
                                              //...其它你想更改或增加的样式
                                            },
                            "activeCSS" : {
                                            "background":"blue"
                                            //...其它你想更改或增加的样式
                                           }
                        });

                 当然，您也可以单独的传入"defaultsCSS" 样式或"activeCSS" 样式，只改变对应状态下的CSS样式。
                 如果在调用时只传入"setNumStyle"参数  如$("#container").lunbo("setNumStyle") 插件将给示数栏设置默认样式。
                 如果您并不需要改变示数栏的样式，并不需要调用该方法，在初始化参数时样式栏就已经被设置默认样式了。

        8.返回指定节点在同辈中的索引号
                您可以获取当前节点在同辈中的索引号。例如：

                $("[data-role='number-container'] li:first-child").lunbo("getIndex")); });

                通过这行代码，您获取了示数栏底部第一个<li>标签的索引号，即0。 （索引号以0为开始，即第一个元素的索引号为0）
                不过仅仅获取索引号，而不进行操作并没有太多意义，以下方法将配合索引号来进行图片切换操作

        9.显示指定的图片
                自定义显示指定的图片，实现代码如下

                $("#container").lunbo("gotoImg",3)

                这行代码将使之前正在显示的图片切换到第三张图片

                通过配合获取索引号的获取方法，可以设置当鼠标滑动到示数栏的<li>标签内显示对应的图片的功能，代码如下：

                $("[data-role='number-container'] li").bind("mousemove" , function(){ $("#container").lunbo("gotoImg",$(this).lunbo("getIndex")); });

                通过对鼠标进入事件的监听，lunbo()中传入"gotoImg"关键字和当前<li>标签的index，从而显示当前<li>标签对应的图片，

