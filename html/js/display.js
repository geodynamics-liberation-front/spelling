/*
 *  The display object
 */
function Display(container,width,height)
{
	// Make the canvas as ours and put it in a frame
	this.canvas=document.createElement("canvas");
	this.canvas.width=width||100;
	this.canvas.height=height||100;
	this.canvas.tabIndex=0;
	this.container=container;
	this.container.appendChild(this.canvas);

	// The off screen canvas
	this.os_canvas=document.createElement("canvas");
	this.os_canvas.width=width||100;
	this.os_canvas.height=height||100;
	this.os_canvas.tabIndex=0;

	// Get the context
	this.paper=this.canvas.getContext('2d');
	this.os_paper=this.os_canvas.getContext('2d');

	// Our internal state
	this.w=0;
	this.h=0;
	this.x=0;
	this.y=0;
	this.zoom_level=1.0;
	this.smooth=false;

	// The points
	this.zIndex=new Object()
	this.layers=[]

	this.resize();
}

Display.prototype.toString = function()
{
	return "Display[canvas#"+this.canvas.id+"]";
}

Display.prototype.setSize = function (w,h)
{
	this.container.style.width=w+"px";
	this.container.style.height=h+"px";
	this.resize();
}

Display.prototype.save = function()
{
	window.open(this.canvas.toDataURL())
}

Display.prototype.resize = function ()
{
	var s=window.getComputedStyle(this.container);
	this.canvas.width=this.container.clientWidth-parseInt(s.getPropertyValue('padding-left'))-parseInt(s.getPropertyValue('padding-right'));
	this.canvas.height=this.container.clientHeight-parseInt(s.getPropertyValue('padding-top'))-parseInt(s.getPropertyValue('padding-bottom'));;
	this.canvas.style.width=this.canvas.width+"px";
	this.canvas.style.height=this.canvas.height+"px";
	this.os_canvas.width=this.canvas.width
	this.os_canvas.height=this.canvas.height
	this.os_canvas.style.width=this.canvas.width+"px"
	this.os_canvas.style.height=this.canvas.height+"px"
	this.w=this.canvas.width/this.zoom_level;
	this.h=this.canvas.height/this.zoom_level;
	this.redraw();
}


Display.prototype.reset = function()
{
	var bounds=this.getBounds();
	console.log(bounds);
	this.w=bounds.width;
	this.h=bounds.height;
	this.canvas.width=this.w;
	this.canvas.height=this.h;
	this.canvas.style.width=this.w+"px";
	this.canvas.style.height=this.h+"px";
	this.x=bounds.x;
	this.y=bounds.y;
	this.zoom_level=1.0;
	this.redraw();
}

Display.prototype.xy = function(e)
{
	var rect = this.canvas.getBoundingClientRect();
	var x=(e.clientX-rect.left)/this.zoom_level-this.x;
	var y=(e.clientY-rect.top)/this.zoom_level-this.y;
	return {'x':x,'y':y};
}

Display.prototype.zoom = function(n,x,y)
{ 
	if( x!=null )
	{
		this.x=(x+this.x)*this.zoom_level/n-x;
		this.y=(y+this.y)*this.zoom_level/n-y;
	}
	this.zoom_level=n;
	this.w=this.canvas.width/this.zoom_level;
	this.h=this.canvas.width/this.zoom_level;
	this.redraw();
}

Display.prototype.add = function(o,z)
{
	var z=z||0
	if( !(z in this.zIndex) )
	{
		this.zIndex[z]=[]
		this.layers=Object.keys(this.zIndex).sort()
	}
	this.zIndex[z].push(o)
	this.redraw()
}

Display.prototype.remove = function(o)
{
	var found=false
	for( var i=0; i<this.layers.length && !found; i++ )
	{
		objects=this.zIndex[this.layers[i]]
		for( var n=0; n<objects.length && !found; n++ )
		{
			if(objects[n] === o )
			{
				objects.splice(i, 1)
				found=true
			}
		}
    }
	this.redraw()
}

Display.prototype.redraw = function()
{
	// Reset the canvas
	this.os_canvas.width=this.os_canvas.width;
	// We like chunky bitmaps
	this.os_paper.imageSmoothingEnabled=this.smooth;
	this.os_paper.scale(this.zoom_level,this.zoom_level); 
	this.os_paper.translate(this.x,this.y);
	for( var i=0; i<this.layers.length; i++ )
	{
		objects=this.zIndex[this.layers[i]]
		for( var n=0; n<objects.length; n++ )
		{
			var o=objects[n]
			this.os_paper.save()
			o.draw(this.os_paper)
			this.os_paper.restore()
		}
	}
	this.canvas.width=this.canvas.width;
	this.paper.drawImage(this.os_canvas,0,0,this.canvas.width,this.canvas.height)
}

