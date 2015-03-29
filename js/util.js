/*
 *  Utility functions
 */
var script_src=document.currentScript.src;
var path=script_src.substring(0,script_src.lastIndexOf('/')+1)

function norm(a)
{
	var t=a.reduce( function(b,c) { return b+c } )
	return a.map( function(b) { return b/t } )
}

function cumsum(a)
{
	a=a.slice() // shallow copy the array
	a.map( function(v,n,ary) { ary[n]+=ary[n-1]||0 } )
	return a
}
