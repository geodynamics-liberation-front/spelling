/*
 * Animator
 */
function Animator(fps,display)
{
	this.objects=[]
	this.display=display
	this.fps=fps
	this.id=null
	
}

Animator.prototype.start = function()
{
	var self=this
	this.id=setInterval(function() {self.animate()},1000/this.fps)
}

Animator.prototype.stop = function()
{
	if( this.id )
	{
		clearInterval(this.id)
		this.id=null
	}
}

Animator.prototype.animate = function()
{
	if( this.objects.length>0 )
	{
		var now=(new Date()).getTime()
		for( var n=this.objects.length-1; n>=0; n-- )
		{
			var start=this.objects[n].start
			var dt=(now-start)/1000 // dt in seconds
			if( dt>=0 )
			{
				var duration=this.objects[n].duration
				if( duration>0 )
				{
					dt=Math.min(1,dt/duration)
				}
				else
				{
					dt=Math.abs(dt/duration)%1
				}
				var pos=this.objects[n].path.getPosition(dt)
				var o=this.objects[n].object
				o.x=pos.x||o.x
				o.y=pos.y||o.y
				o.theta=pos.theta||o.theta
				if(duration>0 && dt>=1)
				{
					this.objects.splice(n, 1)
				}
			}
		}
		var d=this.display
		requestAnimationFrame(function() {d.redraw()})
	}
}

Animator.prototype.measure = function(path,dt)
{
	dt=dt||0.01
	var length=0;
	var p0=path.getPosition(0)
	var p,dx,dy
	
	for( var t=0; t<=1; t+=dt )	
	{
		p=path.getPosition(t)
		dx=p.x-p0.x
		dy=p.y-p0.y
		p0=p
		length+=Math.sqrt(dx*dx+dy*dy) 
	}
	return length
}

Animator.prototype.add = function(o,path,duration,start)
{
	start=start||new Date()
	this.objects.push({'object':o,'path':path,'duration':duration,'start':start.getTime()})
}

Animator.prototype.remove = function(o)
{
	var found=false;
	for( var n=0; n<this.objects.length && !found; n++ )
	{
		if(this.objects[n].object === o )
		{
			this.objects.splice(n, 1)
			found=true
		}
	}
}

function CircularPath(x,y,r,direction,start,stop)
{
	this.x=x
	this.y=y
	this.r=r
	this.direction=(direction!='ccw')*2-1
	this.start=start||0
	this.stop=stop||2*Math.PI
}

CircularPath.prototype.getPosition = function(dt)
{
	var theta=(this.direction*this.stop*dt+this.start)%(2*Math.PI)
	return {'x':this.x+this.r*Math.sin(theta),
			'y':this.y-this.r*Math.cos(theta),
			'theta':this.direction*Math.PI/2+theta}
} 


function FunctionPath(f,dt)
{
	this.f=f
	this.dt=dt||0.01
}

FunctionPath.prototype.getPosition = function(t)
{
	var p
	var p1
	var p2	
	if( t==1 )
	{
		p1=this.f(t-this.dt)
		p2=this.f(t)
		p=p2
	}
	else
	{
		p1=this.f(t)
		p2=this.f(Math.min(1,t+this.dt))
		p=p1
	}
	var dx=p2.x-p1.x
	var dy=p2.y-p1.y
	p['theta']=Math.PI/2+Math.atan2(dy,dx)
	return p;
} 

function LinePath(x1,y1,x2,y2)
{
	var dx=(x2-x1)
	var dy=(y2-y1)
	this.base = FunctionPath
	this.base(function(t) { return {'x':dx*t, 'y':dy*t} })
}
LinePath.prototype=new FunctionPath

function BezierPath(x,y,dt)
{
	this.base = FunctionPath
	this.base(bezier(x,y),dt)
}
BezierPath.prototype=new FunctionPath

function MultiPath(paths,weights)
{
	this.weights_norm=norm(weights)
	this.weights=cumsum(norm(weights))
	this.paths=paths
}

MultiPath.prototype.getPosition = function(t)
{
	var n
	for( n=0; n<this.weights.length; n++ )
	{
		if( (this.weights[n-1]||(-1)<t) && (this.weights[n]>=t) )
		{ 
			break; 
		}
	}
	t=(t-(this.weights[n-1]||0))/this.weights_norm[n]
	return this.paths[n].getPosition(t)
}

function StillPath()
{
}

StillPath.prototype.getPosition = function(t)
{
	return {}
}
