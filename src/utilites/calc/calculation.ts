import { equipments } from './equipments';
import { sectionsCu } from './sectionsCu';

export const calculation = () => {
  return equipments.map(equipment => {
    if(equipment.current > sectionsCu[sectionsCu.length - 1].current) throw new Error('Wire section is not available in the database.');
    let section = null;
    const resSection = sectionsCu.find(section => section.current > equipment.current);
    return {
      name: equipment.name,
      current: equipment.current,
      section: resSection,
    }
  })
}