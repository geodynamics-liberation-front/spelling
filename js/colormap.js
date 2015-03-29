/*
 * Color Palettes
 */
function Grey(depth,f)
{
	this.depth=depth||256
	this.f=f||Function('v','return v')
}
Grey.prototype.color = function(v)
{
	return [this.depth*this.f(v),this.depth*this.f(v),this.depth*this.f(v),255]
}

function BiColor(c1,c2,depth,f)
{
	this.depth=depth||256-1
	this.f=f||Function('v','return v')
	this.c1=c1
	this.c2=c2
}
BiColor.prototype.color = function(v)
{
	return [this.depth*((1-this.f(v))*this.c1[0]+this.f(v)*this.c2[0]),
			this.depth*((1-this.f(v))*this.c1[1]+this.f(v)*this.c2[1]),
			this.depth*((1-this.f(v))*this.c1[2]+this.f(v)*this.c2[2]),
			this.depth*((1-this.f(v))*this.c1[3]+this.f(v)*this.c2[3])]
}
grbl=new BiColor([0,1,0,1],[0,0,1,1])
blpu=new BiColor([0,0,1,1],[1,0,1,1])
bkor=new BiColor([0,0,0,1],[0xd4/0xff,0x55/0xff,0,1])
