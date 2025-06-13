import type { Block } from 'payload'

export const MissionVisionBlock: Block = {
  slug: 'missionVisionBlock',
  interfaceName: 'MissionVisionBlock',
  labels: {
    singular: 'Mission & Vision Block',
    plural: 'Mission & Vision Blocks',
  },
  fields: [
    {
      name: 'backgroundColor',
      type: 'select',
      required: true,
      options: [
        { label: 'Light Gray (bg-slate-50)', value: 'bg-slate-50' },
        { label: 'Medium Gray (bg-slate-100)', value: 'bg-slate-100' },
      ],
      defaultValue: 'bg-slate-50',
      label: 'Background Color',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: false,
      defaultValue: 'Our Mission & Vision',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      defaultValue: 'Our mission defines our purpose and the values that guide our daily work.',
    },
    {
      name: 'missionHeading',
      type: 'text',
      label: 'Mission Heading',
      required: false,
      defaultValue: 'Our Mission',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Media',
    },
    {
      name: 'missionContent',
      type: 'textarea',
      label: 'Mission Content',
      required: false,
      defaultValue:
        "To deliver innovative, high-quality commercial kitchen solutions that enhance operational efficiency, ensure food safety, and contribute to the success of our clients' businesses. We are committed to excellence in design, fabrication, and service, creating value through customized solutions that meet the unique needs of each client.",
    },
    {
      name: 'visionHeading',
      type: 'text',
      label: 'Vision Heading',
      required: false,
      defaultValue: 'Our Vision',
    },
    {
      name: 'visionContent',
      type: 'textarea',
      label: 'Vision Content',
      required: false,
      defaultValue:
        'To be the premier provider of commercial kitchen solutions in the Philippines and Southeast Asia, recognized for our innovation, quality, and customer-centric approach. We aspire to set industry standards, drive technological advancements, and contribute to the evolution of the food service industry through sustainable practices and forward-thinking solutions.',
    },
  ],
}
