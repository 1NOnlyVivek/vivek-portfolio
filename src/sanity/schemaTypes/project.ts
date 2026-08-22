import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Video Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g., Commercial, Cinematic Ads, Motion/3D',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g., 2026',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Link to YouTube, Vimeo, or a direct MP4 file',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true, // Allows you to crop the image in the studio
      },
    }),
  ],
})