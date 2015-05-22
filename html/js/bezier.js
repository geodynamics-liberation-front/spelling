function binomial_coeff(n,k)
{
	if( k==0 || k==n ) { return 1 }
	return binomial_coeff(n-1,k-1)+binomial_coeff(n-1,k)
}

function powstr(v,e)
{
	if( e==0 )
	{
		return ''
	}
	else if (e==1)
	{
		return '*('+v+')'
	}
	else 
	{
		return '*Math.pow('+v+','+e+')'
	}
}

function bezier(x,y)
{
	var x_terms=[]
	var y_terms=[]
	var body="return {'x':x,'y':y}"
	var bc=0,a=0,b=0
	n=x.length-1
	//          n
	// b(n,t) = ∑  (n,i) (1-t)^(n-1) * t^i * w_i
	//         i=0
	for( var i=0; i<=n; i++)
	{
		var bc=binomial_coeff(n,i)
		var a=n-i
		x_terms.push( x[i] + ( bc!=1 ? '*'+bc : '' ) + powstr('1-t',a) + powstr('t',i) )
		y_terms.push( y[i] + ( bc!=1 ? '*'+bc : '' ) + powstr('1-t',a) + powstr('t',i) )
	}
	body= 'x='+x_terms.join(' + ') + '\n' + 'y='+y_terms.join(' + ') + '\n' + body
	return Function('t',body)
}
