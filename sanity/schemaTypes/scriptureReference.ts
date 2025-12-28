import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'scriptureReference',
  title: 'Scripture Reference',
  type: 'object',
  fields: [
    defineField({
      name: 'book',
      title: 'Book',
      type: 'string',
      description: 'Bible book ID (e.g., GEN, PSA, COL)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chapter',
      title: 'Chapter',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'verse',
      title: 'Single Verse',
      type: 'number',
      description: 'Use for single verse (e.g., Colossians 1:13)',
    }),
    defineField({
      name: 'startVerse',
      title: 'Start Verse',
      type: 'number',
      description: 'Start of verse range',
    }),
    defineField({
      name: 'endVerse',
      title: 'End Verse',
      type: 'number',
      description: 'End of verse range',
    }),
  ],
  preview: {
    select: {
      book: 'book',
      chapter: 'chapter',
      verse: 'verse',
      startVerse: 'startVerse',
      endVerse: 'endVerse',
    },
    prepare({ book, chapter, verse, startVerse, endVerse }) {
      let reference = `${book} ${chapter}`
      if (verse) {
        reference += `:${verse}`
      } else if (startVerse && endVerse) {
        reference += `:${startVerse}-${endVerse}`
      } else if (startVerse) {
        reference += `:${startVerse}`
      }
      return {
        title: reference,
      }
    },
  },
})
