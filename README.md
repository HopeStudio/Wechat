### 第35章 使用canvas元素（第1部分）
##### 内容概要
问题 | 解决方案 
----|------
准备用来绘图的canvas | 在DOM中找到canvas元素，然后调用HTMLCanvasObject上的getContext方法  
绘制矩形 | 使用fillRect或strokeRect方法  
清除矩形 | 使用clearRect方法
设置绘图操作的样式 | 在执行前设置绘制状态属性（如lineWidth、lineJoin）的值
在绘图操作中使用纯色 | 给fillStyle或strokeStyle属性设置一个颜色值或名称
创建线性渐变 | 调用createLinearGradient方法，并通过addColorStop方法给渐变添加颜色
创建径向渐变 | 调用createRadialGradient方法，并通过addColorStop方法给渐变添加颜色
创建图案 | 调用createPattren方法，指定图案文件的来源和重复方式
保存和恢复绘制状态 | 使用save和restore方法
在画布上绘制图像 | 使用drawImage方法，指定一个img、canvas或video元素作为来源