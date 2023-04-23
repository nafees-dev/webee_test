import { MigrationInterface, QueryRunner } from "typeorm";

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE movies (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      duration INTERVAL NOT NULL
    )`);

    await queryRunner.query(`CREATE TABLE showrooms (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL
    )`);

    await queryRunner.query(`CREATE TABLE shows (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      movie_id INTEGER NOT NULL REFERENCES movies(id),
      showroom_id INTEGER NOT NULL REFERENCES showrooms(id),
      price DECIMAL(5,2) NOT NULL,
      CONSTRAINT unique_movie_showroom_start_time UNIQUE (movie_id, showroom_id, start_time)
    )`);

    await queryRunner.query(`CREATE TABLE seat_types (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      premium DECIMAL(5,2) NOT NULL
    )`);

    await queryRunner.query(`CREATE TABLE seats (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      type_id INTEGER NOT NULL REFERENCES seat_types(id),
      showroom_id INTEGER NOT NULL REFERENCES showrooms(id),
      CONSTRAINT unique_seat_name_showroom UNIQUE (name, showroom_id)
    )`);

    await queryRunner.query(`CREATE TABLE bookings (
      id SERIAL PRIMARY KEY,
      show_id INTEGER NOT NULL REFERENCES shows(id),
      seat_id INTEGER NOT NULL REFERENCES seats(id),
      CONSTRAINT unique_show_seat_booking UNIQUE (show_id, seat_id)
    )`);
    // throw new Error("TODO: implement migration in task 4");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE bookings`);
    await queryRunner.query(`DROP TABLE seats`);
    await queryRunner.query(`DROP TABLE seat_types`);
    await queryRunner.query(`DROP TABLE shows`);
    await queryRunner.query(`DROP TABLE showrooms`);
    await queryRunner.query(`DROP TABLE movies`);
  }
}
