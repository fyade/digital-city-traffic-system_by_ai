export class LayerDto {
  id!: string
  name!: string
  preview!: string
  func!: () => void
  dataType!: string
  fromCompany!: string
  fromUrl!: string
}

export class ContextMenuItem {
  id!: string
  func!: () => void
}
