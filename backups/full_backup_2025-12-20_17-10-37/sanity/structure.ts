import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Reading Plans section
      S.listItem()
        .title('Reading Plans')
        .child(
          S.documentTypeList('readingPlan')
            .title('Reading Plans')
        ),
      // Daily Readings section
      S.listItem()
        .title('Daily Readings')
        .child(
          S.documentTypeList('dailyReading')
            .title('Daily Readings')
            .defaultOrdering([{ field: 'day', direction: 'asc' }])
        ),
      // Daily Fire (existing)
      S.listItem()
        .title('Daily Fire Devotionals')
        .child(
          S.documentTypeList('dailyFire')
            .title('Daily Fire Devotionals')
        ),
      // Divider
      S.divider(),
      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['readingPlan', 'dailyReading', 'dailyFire'].includes(
            listItem.getId() || ''
          )
      ),
    ])
