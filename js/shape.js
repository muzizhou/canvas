
function shape (copy,cobj,xp){
    this.copy=copy;
    this.cobj=cobj;
    this.xp=xp;
    this.style="stroke";
    this.history=[];
    this.type="line";
    this.fillStyle="#000";
    this.strokeStyle="#fff";
    this.lineWidth=1;
    this.flag=true;
    this.offsetW=copy.offsetWidth;
    this.offsetH=copy.offsetHeight;
    this.bianNum=5;
    this.jiaoNum=5;
    this.xpsize=10;
    this.isback=true;
    this.flag=true;
};
shape.prototype={
    init:function(){
        this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.fillStyle=this.fillStyle;
        this.cobj.lineWidth=this.lineWidth;
        this.isback=true;
    },
    draw:function(){
        var that=this;
        that.init()
        this.flag=true
        that.copy.onmousedown=function(e){
            this.flag=true
            that.init()
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.copy.onmousemove=function(e){
                this.flag=true
                var movex= e.offsetX;
                var movey= e.offsetY;
                that.cobj.clearRect(0,0,that.offsetW,that.offsetH)//
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                that[that.type](startx,starty,movex,movey)
            }
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.offsetW,that.offsetH))
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    /*钢笔*/
    pen:function(){
        var that=this;
        that.init()
        this.flag=true
        that.copy.onmousedown=function(e){
            this.flag=true
            that.init()
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath()
            that.cobj.moveTo(startx,starty)

            that.copy.onmousemove=function(e){
                this.flag=true
                var movex= e.offsetX;
                var movey= e.offsetY;
                that.cobj.lineTo(movex,movey)
                that.cobj.stroke()
            }
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.offsetW,that.offsetH))
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }
        }
    },
    /*线条*/
    line:function(x,y,a,b){
        this.cobj.beginPath()
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(a,b);
        this.cobj.stroke()
    },
    /*矩形*/
    rect:function(x,y,a,b){
        this.cobj.beginPath()
        this.cobj.rect(x,y,a-x,b-y)
        this.cobj[this.style]()
    },
    /*圆形*/
    arc:function(x,y,a,b){
        this.cobj.beginPath()
        var r=Math.sqrt((a-x)*(a-x)+(b-y)*(b-y))
        this.cobj.arc(x,y,r,0,2*Math.PI)
        this.cobj[this.style]()
    },
    /*多边形*/
    bian:function(x,y,a,b){
        this.cobj.beginPath()
        var r=Math.sqrt((a-x)*(a-x)+(b-y)*(b-y));
        var a=360/this.bianNum*Math.PI/180;
        for(var i=0;i<this.bianNum;i++){
            this.cobj.lineTo(x+Math.cos(a*i)*r,y+Math.sin(a*i)*r)
        }
        this.cobj.closePath()
        this.cobj[this.style]()
    },
    /*多角形*/
    jiao:function(x,y,a,b){
        this.cobj.beginPath()
        var r=Math.sqrt((a-x)*(a-x)+(b-y)*(b-y));
        var r1=r/3;
        var a=360/(this.jiaoNum*2)*Math.PI/180;
        for(var i=0;i<this.jiaoNum*2;i++){
            if(i%2==0){
                this.cobj.lineTo(x+Math.cos(a*i)*r,y+Math.sin(a*i)*r)
            }else{
                this.cobj.lineTo(x+Math.cos(a*i)*r1,y+Math.sin(a*i)*r1)
            }

        }
        this.cobj.closePath()
        this.cobj[this.style]()
    },
    /*橡皮*/
    clear:function(){
        var that=this;
        that.copy.onmousemove=function(e){
            var movex= e.offsetX;
            var movey= e.offsetY;
            var left=movex-that.xpsize/2;
            var top=movey-that.xpsize/2;
            if(left<0){
                left=0
            }
            if(top<0){
                top=0
            }
            if(left>that.offsetW-that.xpsize){
                left=that.offsetW-that.xpsize
            }
            if(top>that.offsetH-that.xpsize){
                top=that.offsetH-that.xpsize
            }
            that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px;"
        }
        that.copy.onmousedown=function(){
            that.copy.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                var left=movex-that.xpsize/2;
                var top=movey-that.xpsize/2;
                if(left<0){
                    left=0
                }
                if(top<0){
                    top=0
                }
                if(left>that.offsetW-that.xpsize){
                    left=that.offsetW-that.xpsize
                }
                if(top>that.offsetH-that.xpsize){
                    top=that.offsetH-that.xpsize
                }

                that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px;"
                that.cobj.clearRect(left,top,that.xpsize,that.xpsize)
            }
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.offsetW,that.offsetH))
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.clear()
            }
        }
    },
    /*返回*/
    back:function(){
        if(this.history.length==0){
            this.cobj.clearRect(0,0,this.offsetW,this.offsetH)
            alert("不能返回")
            return;
        }
        if(this.flag){
            if(this.history.length==1){
                this.history.pop()
                this.cobj.clearRect(0,0,this.offsetW,this.offsetH)
            }else{
                this.history.pop()
                this.cobj.putImageData(this.history.pop(),0,0)
            }
        }else{
            this.cobj.putImageData(this.history.pop(),0,0)
        }
        this.flag=false
    },
    /*保存*/
    /*new:function(){
        if(this.histroy.length>0){
            var yes=confirm("是否保存")
            if(yes==true){
                location.href=this.cobj.toDataURL().replace("image/png","stream/octet")
                this.cobj.history=[];
                this.cobj.clearRect(0,0,this.offsetW,this.offsetH)
                $()
            }
        }
    }*/
}

