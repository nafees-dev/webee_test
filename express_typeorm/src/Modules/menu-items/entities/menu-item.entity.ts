import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ type: "integer", default: null })
  parentId: number;

  @Column({ type: "datetime" })
  createdAt: string;

  @OneToMany((type) => MenuItem, (menuItem) => menuItem.parentId)
  children: MenuItem[];
}
