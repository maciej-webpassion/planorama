import { Group } from 'konva/lib/Group';
import { Transformer } from 'konva/lib/shapes/Transformer';

export function resetGroupTransforms(group: Group, tr: Transformer) {
  group.setAttrs({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  });
  group.clearCache();
  group.destroyChildren();
  tr.nodes([]);
  console.log('reset group');
}
