import {HttpClient, HttpParams} from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";


@Injectable({
    providedIn: 'root'
})

export class DataStorageService {

    constructor(private http: HttpClient, private recipeServices: RecipeService, private authService: AuthService){}


    storeRecipes() {
         const recipe = this.recipeServices.getRecipes();
         this.http.put('https://ng-cotde-recipe-book-default-rtdb.firebaseio.com/recipes.json', recipe).subscribe(response => {
            console.log(response);

         });
    }


    fetchRecipes() {


        return this.http.get<Recipe[]>('https://ng-cotde-recipe-book-default-rtdb.firebaseio.com/recipes.json',).
        pipe(
          map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        })
      }), tap(recipes => {
        this.recipeServices.setRecipes(recipes);
      }))



    }
}
