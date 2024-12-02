 
/* Sample generic helper for ajax using the traditional XMLHttpRequest */
export function doAjax(url,method,data=null) {
	return new Promise(function(resolve,reject){
		var xr=new XMLHttpRequest();
		xr.onreadystatechange=function(){
			if(xr.readyState==4){
				let obj=null;
				try{
					obj=JSON.parse(xr.responseText);
				}
				catch(x){
					console.log("Not a json response");
				}
				if((xr.status>=200)&&(xr.status<300)) resolve(obj,xr);
				else reject(obj,xr);
			}
		}
		xr.open(method,url,true);
		xr.setRequestHeader("Content-Type","application/json");
		xr.setRequestHeader("Accept","application/json");
		xr.send(data && JSON.stringify(data));
	});
}

/* Object providing the basic CRUD */
export const HTTP={
	get: (url) => doAjax(url,'get'),
	delete: (url) => doAjax(url,'delete'),
	put: (url,data) => doAjax(url,'put',data),
	post: (url,data) => doAjax(url,'post',data)
};
