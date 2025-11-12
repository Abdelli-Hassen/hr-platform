import { Pipe, type PipeTransform } from "@angular/core"

@Pipe({
  name: "count",
  standalone: true,
})
export class CountPipe implements PipeTransform {
  transform(items: any[], jobId: number): number {
    return items.filter((item) => item.jobOpeningId === jobId).length
  }
}
