import { Brackets } from 'typeorm';

export function querySearch(query: any, querySearch: string, conditions: any) {
    const params = querySearch.split(':')[1];
    const obj = {}
    obj[params] = conditions;
    return query.andWhere(
      new Brackets((q) => {
        q.where(querySearch, obj);
      }),
    );
}
