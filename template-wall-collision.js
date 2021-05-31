import { libWrapper } from './shim.js'
const MODULE_ID = 'template-wall-collision';
	
Hooks.once("init", () => {
	console.log("Template Wall Collision Loaded");
});

Hooks.on('renderMeasuredTemplateConfig', (app, html, data) => {
	app.setPosition({
		height: 466,
		width: 475,
	});

	if (app.object.getFlag(MODULE_ID, 'checkWallCollision') === undefined) {
		app.object.setFlag(MODULE_ID, 'checkWallCollision', 'false');
	}
	if (app.object.getFlag(MODULE_ID, 'x') === undefined) {
		app.object.setFlag(MODULE_ID, 'x', 0 );
	}
	if (app.object.getFlag(MODULE_ID, 'y') === undefined) {
		app.object.setFlag(MODULE_ID, 'y', 0 );
	}	
	const message = app.object.getFlag(MODULE_ID, 'checkWallCollision') == 'true' ? 
	`<div class="form-group">
		<label>Enable Collision With Walls?</label>
		<select name="flags.${MODULE_ID}.checkWallCollision">
		<option value=true>True</option>
		<option value=false>False</option>
		</select>
	</div>
	`
	:
	`<div class="form-group">
	<label>Enable Collision With Walls?</label>
	<select name="flags.${MODULE_ID}.checkWallCollision">
	<option value=false>False</option>
	<option value=true>True</option>
	</select>
	</div>
	`;

	let originX = app.object.data.flags[`${MODULE_ID}`]?.x || "0";
	let originY = app.object.data.flags[`${MODULE_ID}`]?.y || "0";

	const message2 = 
	`<div class="form-group">
		<label>Origin Offset:[X,Y]</label>
		<input style="max-width:50%" type="text" name="flags.${MODULE_ID}.x" value="${originX}" data-dtype="Number"/>
		<input style="max-width:50%" type="text" name="flags.${MODULE_ID}.y" value="${originY}" data-dtype="Number"/>
	</div>
	`;

	html.find(".form-group").last().after(message);
	html.find(".form-group").last().after(message2);

	console.log(app.object.data.flags)
});

function MeasuredTemplateOver(obj) {
	//code from highlightGrid() unedited 
	const grid = canvas.grid;
	const d = canvas.dimensions;
	const border = obj.borderColor;
	const color = obj.fillColor;

	// Only highlight for objects which have a defined shape
	if ( !obj.id || !obj.shape ) return;

	// Clear existing highlight
	const hl = grid.getHighlightLayer(`Template.${obj.id}`);
	hl.clear();

	// If we are in gridless mode, highlight the shape directly
	if ( grid.type === CONST.GRID_TYPES.GRIDLESS ) {
		const shape = obj.shape.clone();
		if ( "points" in shape ) {
			shape.points = shape.points.map((p, i) => {
				if ( i % 2 ) return obj.y + p;
				else return obj.x + p;
			});
		} else {
			shape.x += obj.x;
			shape.y += obj.y;
		}
		return grid.grid.highlightGridPosition(hl, {border, color, shape});
	}
	
	
	// Code from highlightGrid(), slight edit to make it more efficent
	// Get number of rows and columns
	const nr = grid.type === CONST.GRID_TYPES.SQUARE ? 
		Math.ceil(((obj.data.distance * 1 ) / d.distance) / (d.size / grid.h)) + 1 : Math.ceil(((obj.data.distance * 1.5 ) / d.distance) / (d.size / grid.h));
	const nc = grid.type === CONST.GRID_TYPES.SQUARE ? 
		Math.ceil(((obj.data.distance * 1 ) / d.distance) / (d.size / grid.w)) + 1 :  Math.ceil(((obj.data.distance * 1.5 ) / d.distance) / (d.size / grid.w));
	
	//code from highlightGrid() unedited 
	// Get the offset of the template origin relative to the top-left grid space
	const [tx, ty] = canvas.grid.getTopLeft(obj.data.x, obj.data.y);
	const [row0, col0] = grid.grid.getGridPositionFromPixels(tx, ty);
	const hx = canvas.grid.w / 2;
	const hy = canvas.grid.h / 2;
	const isCenter = (obj.data.x - tx === hx) && (obj.data.y - ty === hy);

	// canvas.walls.checkCollision
	// Identify grid coordinates covered by the template Graphics
	// let originX = !!obj.data.flags[`${MODULE_ID}`].origin[`x`] ? obj.data.flags[`${MODULE_ID}`].origin[`x`] : obj.data.x;
	// let originY = !!obj.data.flags[`${MODULE_ID}`].origin[`y`] ? obj.data.flags[`${MODULE_ID}`].origin[`y`] : obj.data.y;

	let originX = obj.data.x + obj.data.flags[`${MODULE_ID}`]?.x | obj.data.x;
	let originY = obj.data.y + obj.data.flags[`${MODULE_ID}`]?.y | obj.data.y;

	for (let r = -nr; r < nr; r++) {
		for (let c = -nc; c < nc; c++) {
			let [gx, gy] = canvas.grid.grid.getPixelsFromGridPosition(row0 + r, col0 + c);
			const testX = (gx+hx) - obj.data.x;
			const testY = (gy+hy) - obj.data.y;
			let contains = ((r === 0) && (c === 0) && isCenter ) || obj.shape.contains(testX, testY);
			let rayTest = new Ray({x:originX, y:originY}, {x:obj.data.x + testX, y:obj.data.y + testY});
			
			
			if ( !contains ) continue;
			if( obj.data.flags[`${MODULE_ID}`]?.checkWallCollision == 'true' &&  canvas.walls.checkCollision(rayTest)) {
				contains = false;
				continue;
			}

			grid.grid.highlightGridPosition(hl, {x: gx, y: gy, border, color});
		}
	}
}

Hooks.on("getSceneControlButtons", function(controls){
	console.dir(canvas)
	controls[1].tools.splice(controls[1].tools.length-1,0,{
		name: "collision",
		title: "Toggle template collision with walls.",
		icon: "fas fa-external-link-square-alt",
		toggle: true,
		active: !!canvas?.templates?._setWallCollision,
		onClick: toggled => canvas.templates._setWallCollision = toggled
  })
  return controls;
	
})

Hooks.once('setup', function () {
	libWrapper.register(
		MODULE_ID,
		'MeasuredTemplate.prototype.highlightGrid',
		function() {
			MeasuredTemplateOver(this);
			return;
		},
		'OVERRIDE',
	);
});

Hooks.on("ready", () => {
	canvas.templates[`_setWallCollision`] = false;
});


Hooks.on("createMeasuredTemplate", (obj) =>{
	obj.setFlag(MODULE_ID, 'checkWallCollision', canvas.templates[`_setWallCollision`].toString());
	obj.setFlag(MODULE_ID, 'x', 0);
	obj.setFlag(MODULE_ID, 'y', 0);
});