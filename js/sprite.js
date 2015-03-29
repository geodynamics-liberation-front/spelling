/*
 * A sprite
 */
function Sprite(args)
{
	if( args )
	{
		this.x=args['x']||0
		this.y=args['y']||0
		this.theta=args['theta']||0
	}
}
	
Sprite.prototype.draw = function(paper)
{
	paper.translate(this.x,this.y)
	paper.rotate(this.theta)
	this.drawSprite(paper)
}

/*
 *  PathAnimator
 */
function PathAnimator(args)
{
	args=args||{}
	this.strokeStyle=args['strokeStyle']||"black"
	this.lineWidth=args['linewidth']||1
	this._x=[]
	this._y=[]
	this.theta=0
	var self=this
    this.__defineGetter__("x", function(){ return self._x[_x.length-1]||0; });
    this.__defineSetter__("x", function(v){ self._x.push(v) });
    this.__defineGetter__("y", function(){ return self._y[_y.length-1]||0; });
    this.__defineSetter__("y", function(v){ self._y.push(v) });
}

PathAnimator.prototype.draw = function(paper)
{
	if( this._x.length>1 )
	{
		paper.strokeStyle=this.strokeStyle
		paper.lineWidth=this.lineWidth
		paper.moveTo(this._x[0],this._y[0])
		for( var n=1; n<this._x.length; n++ )
		{
			paper.lineTo(this._x[n],this._y[n])
		}
		paper.stroke()
	}
}

PathAnimator.prototype.reset = function()
{
	this._x=[]
	this._y=[]
	this.theta=0
}

/*
 * An image sprite
 * Arguments: 
 *  image
 *  x
 *  y
 *  w
 *  h
 *  theta
 *  sx
 *  sy
 *  sw
 *  sh
 *  center
 *
	
Image Sprite needs a loaded image,
	var iSprite
	var i=new Image()
	i.addEventListener('load',function () { iSprite=new ImageSprite({'image':i}) } )
	i.src=src
}
 */
function ImageSprite(args)
{
	this.base = Sprite
	if( args )
	{
		this.base(args)
		this.image=args['image']
		this.w=args['w']
		this.h=args['h']
		this.center=args['center']||{ 'x':(this.w||this.image.width)/2,'y':(this.h||this.image.height)/2 }
		this.sx=args['sx']
		this.sy=args['sy']
		this.sw=args['sw']
		this.sh=args['sh']
	}
}
ImageSprite.prototype = new Sprite;

ImageSprite.prototype.drawSprite = function(paper)
{
	if( this.sx ) 
	{ 
 		paper.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, -this.center.x, -this.center.y, this.w, this.h)
	}
	else if ( this.w )
	{
 		paper.drawImage(this.image, -this.center.x, -this.center.y, this.w, this.h)
	}
	else
	{
 		paper.drawImage(this.image, -this.center.x, -this.center.y)
	}
}

ImageSprite.prototype.scale = function(s)
{
	if( !this.w )
	{
		this.w=this.image.width
	}
	if( !this.h )
	{
		this.h=this.image.height
	}
	this.w*=s
	this.h*=s
	this.center.x*=s
	this.center.y*=s
}


/*
 *  The planets
 */
function Planet(args)
{
	this.base = ImageSprite
	if( args )
	{
		var self=this
		var i=new Image()
		args['image']=i
		i.addEventListener('load',function () { self.base(args) }) 
		this.renderSurface(args)
	}
}
Planet.prototype = new ImageSprite

Planet.prototype.renderSurface = function (args)
{
	var r=args['r']
	var palette=args['palette']||new Grey(depth)
	var depth=args['depth']||256
	var its=args['its']||1000
	var png=new PNGlib(2*r,2*r,depth)
	var surface=new Array()
	for( var j=0; j<2*r; j++ )
	{
		surface[j]=new Array()
		for( var k=0; k<2*r; k++ )
		{
			surface[j][k]=png.depth/2
		}
	}

	for( var n=0; n<its; n++ )
	{
		var x1=Math.random()*2*r
		var y1=Math.random()*2*r
		var x2=Math.random()*2*r
		var y2=Math.random()*2*r
		var m=(y2-y1)/(x2-x1)
		var b=y1-m*x1
		var a=Math.round(Math.random())*2-1
		for( var j=0; j<2*r; j++ )
		{
			for( var k=0; k<2*r; k++ )
			{
				if( m*j+b > k )
				{
					surface[j][k]=Math.min(Math.max(surface[j][k]+a,0),png.depth-1)
				}
				else
				{
					surface[j][k]=Math.min(Math.max(surface[j][k]-a,0),png.depth-1)
				}
			}
		}
	}
	for( var j=0; j<2*r; j++ )
	{
		for( var k=0; k<2*r; k++ )
		{
			var v=surface[j][k]/png.depth
			if( (v<0) || (v>1) )
			{
				console.error('Value out of bounds '+v)
			}
			if( (j-r)*(j-r) + (k-r)*(k-r)< r*r )
			{
				png.buffer[png.index(j,k)] = png.color.apply(png,palette.color(v))
			}
			else
			{
				png.buffer[png.index(j,k)] = png.color(0,0,0,0)
			}
		}
	}
	var image=args['image']
	var src="data:image/png;base64,"+png.getBase64() 
	image.src=src
	return image
}
