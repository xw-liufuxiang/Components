/* eslint-disable */
const regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

function rectHandler(node) {
  let path = void 0;
  const x = Number(node.x);
  const y = Number(node.y);
  const width = Number(node.width);
  const height = Number(node.height);

  let rx = Number(node.rx) || Number(node.ry) || 0;
  let ry = Number(node.ry) || Number(node.rx) || 0;

  if (isNaN(x - y + width - height + rx - ry)) return;

  rx = rx > width / 2 ? width / 2 : rx;
  ry = ry > height / 2 ? height / 2 : ry;

  if (rx == 0 || ry == 0) {
    path = `M${x} ${y}h${width}v${height}h${-width}z`;
  } else {
    path = `M${x} ${y + ry}a${rx} ${ry} 0 0 1 ${rx} ${-ry}h${width - rx - rx}a${rx} ${ry} 0 0 1 ${rx} ${ry}v${height - ry - ry}a${rx} ${ry} 0 0 1 ${-rx} ${ry}h${rx + rx - width}a${rx} ${ry} 0 0 1 ${-rx} ${-ry}z`;
  }

  return {
    d: path,
    fill: formateColor(node.fill),
    stroke: formateColor(node.stroke),
  };
}

function circleHandler(node) {
  const { cx } = node;
  const { cy } = node;
  const { r } = node;
  const path = `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0` + `a${r} ${r} 0 1 0 ${-2 * r} 0` + 'z';

  return {
    d: path,
    fill: formateColor(node.fill),
    stroke: formateColor(node.stroke),
  };
}

function ellipseHandler(node) {
  const { cx } = node;
  const { cy } = node;
  const { rx } = node;
  const { ry } = node;
  const path = `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0` + `a${rx} ${ry} 0 1 0 ${-2 * rx} 0` + 'z';

  return {
    d: path,
    fill: formateColor(node.fill),
    stroke: formateColor(node.stroke),
  };
}

function lineHandler(node) {
  const x1 = node.getAttribute('x1');
  const y1 = node.getAttribute('y1');
  const x2 = node.getAttribute('x2');
  const y2 = node.getAttribute('y2');
  if (isNaN(x1 - y1 + x2 - y2)) return;
  const path = `M${x1} ${y1}L${x2} ${y2}`;
  return {
    d: path,
    fill: formateColor(node.fill),
    stroke: formateColor(node.stroke),
  };
}

module.exports = function (node, type) {
  if (!type) return;

  switch (type.toLowerCase()) {
    case 'rect':
      return rectHandler(node);
    case 'circle':
      return circleHandler(node);
    case 'ellipse':
      return ellipseHandler(node);
    case 'line':
      return lineHandler(node);
    case 'path':
      return {
        d: node.d,
        fill: node.fill == undefined && node.fill == '#000000' ? '' : node.fill,
        stroke: formateColor(node.stroke),
      };
    case 'polygon':
    case 'polyline':
      var points = (node.getAttribute('points').match(regNumber) || []).map(Number);
      if (points.length < 4) {
        return;
      }
      var path = `M${points.slice(0, 2).join(' ')}L${points.slice(2).join(' ')}${type === 'polygon' ? 'z' : ''}`;
      return {
        d: path,
        fill: formateColor(node.fill),
        stroke: formateColor(node.stroke),
      };
  }
};

function formateColor(prop) {
  if (!prop) {
    return 'transparent';
  } if (prop === '#000000') {
    return '';
  }
  return prop;
}
